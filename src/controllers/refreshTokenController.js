const refreshTokenController = require('express').Router();
const { getUserForTokenGenereating } = require('../services/userService');
const { parseRefreshToken } = require('../utils/parseToken');

refreshTokenController.post('/', async (req, res) => {
  const refreshToken = req.cookies['refreshToken'];
  console.log(refreshToken);
  if (!refreshToken) {
    return res.status(401).send('Access Denied. No refresh token provided.');
  }
  if (refreshToken) {
    console.log('have refreshtoken');
    try {
      console.log('before');
      const payload = parseRefreshToken(refreshToken);
      console.log('after');
      const userId = payload._id;
      const tokens = await getUserForTokenGenereating(userId);
      const accessToken = tokens.accessToken;
      const refreshToken = tokens.refreshToken;
      console.log(tokens);
      res
        .status(200)
        .cookie('refreshToken', refreshToken, {
          httpOnly: true,
          sameSite: 'strict',
        })
        // .header('Authorization', accessToken)
        .send(accessToken);
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
