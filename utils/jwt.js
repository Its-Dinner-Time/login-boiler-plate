import jwt from 'jsonwebtoken';
import prisma from '../prisma/index.js';

const tokenKey = process.env.SECURE;

const access = (user) => {
  const payload = { id: user.id, userId: user.userId, name: user.name };
  // secret으로 sign하여 발급하고 return
  return jwt.sign(payload, tokenKey, {
    algorithm: 'HS256', // 암호화 알고리즘
    expiresIn: '10m', // 유효기간
  });
};

// access token 검증
const accessVerify = (token) => {
  const result = {};
  try {
    const decoded = jwt.verify(token, tokenKey);

    result.ok = true;
    result.user = decoded;
  } catch (err) {
    result.ok = false;
    result.err = err.message;
  }

  return result;
};

const refresh = () => {
  // refresh token은 payload 없이 발급
  return jwt.sign({}, tokenKey, {
    algorithm: 'HS256',
    expiresIn: '14d', // 2주
  });
};

// refresh token 검증
const refreshVerify = async (token) => {
  const user = await prisma.user.findFirst({
    where: { refreshToken: token },
  });

  if (!user) {
    return { ok: false, error: new Error('유효하지 않은 token') };
  }

  const result = {};
  try {
    jwt.verify(token, tokenKey);

    result.ok = true;
    result.user = user;
  } catch (err) {
    result.ok = false;
    result.err = err.message;
  }
  return result;
};

const removeBearer = (str) => str?.replace(/^Bearer\s+/, '');

export default {
  access,
  accessVerify,
  refresh,
  refreshVerify,
  removeBearer,
};
