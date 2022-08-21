import jwtUtil from '../utils/jwt.js';
import prisma from '../prisma/index.js';

export const access = (req, res) => {
  const user = req.body;
  const token = jwtUtil.access({ id: user.id, userId: user.userId, name: user.name });

  return res.json({ ok: true, token });
};

export const verify = (req, res) => {
  const token = req.body.token;

  const verified = jwtUtil.accessVerify(token);
  return res.json(verified);
};

export const login = async (req, res) => {
  const body = req.body;
  const { userId, password } = body;

  // db에서 정보 조회
  const user = await prisma.user.findFirst({
    where: { userId, password },
  });

  // 조회된 정보가 없는 경우
  if (!user) return res.json({ ok: false, err: new Error('No User') });

  // access token, refresh token 발급
  const accessToken = jwtUtil.access({ id: user.id, userId: user.userId, name: user.name });
  const refreshToken = jwtUtil.refresh();

  if (!accessToken || !refreshToken) return res.json({ ok: false, err: new Error('Token발급 오류') });

  // db의 refresh token update
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return res.json({ ok: true, accessToken, refreshToken });
};

export const logout = async (req, res) => {
  const body = req.body;
  const { id } = body;

  // refreshToken 폐기
  await prisma.user.update({
    where: { id },
    data: { refreshToken: null },
  });

  return res.json({ ok: true });
};
