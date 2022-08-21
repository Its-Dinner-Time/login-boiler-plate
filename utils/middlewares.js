export function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
}

export function accessTokenVerify(req, res, next) {
  const token = req.body.token;

  const verified = jwtUtil.accessVerify(token);
  res.json(verified);
  next();
}
