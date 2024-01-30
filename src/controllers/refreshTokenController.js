const refreshTokenController = require('express').Router();
const { getUserForTokenGenereating } = require('../services/userService');
const { parseRefreshToken } = require('../utils/parseToken');

refreshTokenController.post('/', async (req, res) => {
  const cookieRefreshToken = req.cookies['refreshToken'];
  if (!cookieRefreshToken) {
    return res.status(401).send('Access Denied. No refresh token provided.');
  }
  if (cookieRefreshToken) {
    try {
      const payload = parseRefreshToken(cookieRefreshToken);
      const userId = payload._id;
      const tokens = await getUserForTokenGenereating(userId);
      const accessToken = tokens.accessToken;
      const refreshToken = tokens.refreshToken;
      res
        .status(200)
        .cookie('refreshToken', refreshToken, {
          httpOnly: true,
          sameSite: 'strict',
        })
        // .header('Authorization', accessToken)
        .send({ accessToken });
      res.end();
      res.end();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
  }
});
module.exports = {
  refreshTokenController,
};
