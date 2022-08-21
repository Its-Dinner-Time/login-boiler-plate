import jwtUtil from '../utils/jwt.js';
import prisma from '../prisma/index.js';

export const verify = async (req, res) => {
  const accesstoken = req.headers['x-access-token'];

  const verified = jwtUtil.accessVerify(jwtUtil.removeBearer(accesstoken));
  if (verified.ok) return res.json(verified);

  //
  // ====== access token 검증 실패

  // refresh token 검증
  const refreshtoken = req.signedCookies[process.env.REFRESH_TOKEN_KEY];

  const refreshVerified = await jwtUtil.refreshVerify(jwtUtil.removeBearer(refreshtoken));
  if (!refreshVerified.ok) return res.json({ ok: false, err: '토큰 재발급을 위한 로그인 필요' });

  //
  // ====== refresh token 검증 성공

  // access token 재 발급
  const user = refreshVerified.user;
  const newToken = jwtUtil.access(user);

  return res.json({ ok: true, accessToken: newToken, user: jwtUtil.accessVerify(newToken) });
};

export const login = async (req, res) => {
  const body = req.body;
  const { userId, password } = body;

  // db에서 정보 조회
  const user = await prisma.user.findFirst({
    where: { userId, password },
  });

  // 조회된 정보가 없는 경우
  if (!user) return res.json({ ok: false, err: 'No User' });

  // access token, refresh token 발급
  const accessToken = jwtUtil.access(user);
  const refreshToken = jwtUtil.refresh();

  if (!accessToken || !refreshToken) return res.json({ ok: false, err: 'Token발급 오류' });

  // db의 refresh token update
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  // refresh token httpOnly cookie에 저장
  res.cookie(process.env.REFRESH_TOKEN_KEY, refreshToken, { httpOnly: true, signed: true });

  // client에서 accessToken 저장
  return res.json({ ok: true, accessToken, user: jwtUtil.accessVerify(accessToken) });
};

export const logout = async (req, res) => {
  const body = req.body;
  const { id } = body;

  // refreshToken 폐기
  await prisma.user.update({
    where: { id },
    data: { refreshToken: null },
  });

  res.clearCookie(process.env.REFRESH_TOKEN_KEY);

  return res.json({ ok: true });
};
