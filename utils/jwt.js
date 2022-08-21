// jwt 인증

// 1. userId, password로 DB에서 정보조회
//  1-1. => 정보조회 실패시 실패 정보 return

// 2. 조회한 user정보를 담아 jwt.sign 호출하여 access token, refresh token 생성
// 3. access token: client에서 해당 token을 cookie(server) 또는 localStorage(client)에 저장
//    refresh token: db에 token값 저장

// 4. client router middleware에 access token을 검증하는 server router호출
//  4-1. => TokenExpired일 경우 refresh token을 검증하는 server router호출
//    4-1-1. => refresh token이 expired인 경우 로그인 페이지로 redirect

import jwt from 'jsonwebtoken';

const tokenKey = process.env.JWT_KEY;

const access = (user) => {
  // secret으로 sign하여 발급하고 return
  return jwt.sign(user, tokenKey, {
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
    result.err = err;
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
const refreshVerify = async (clientToken, dbToken) => {
  if (clientToken !== dbToken) {
    return { ok: false, error: new Error('유효하지 않은 token') };
  }

  const result = {};
  try {
    jwt.verify(dbToken, tokenKey);

    result.ok = true;
  } catch (err) {
    result.ok = false;
    result.err = err;
  }
  return result;
};

export default {
  access,
  accessVerify,
  refresh,
  refreshVerify,
};
