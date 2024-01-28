const refreshTokenController = require('express').Router();
const { getUserForTokenGenereating } = require('../services/userService');
const { parseRefreshToken } = require('../utils/parseToken');

refreshTokenController.post('/', async (req, res) => {
  const refreshToken = req.cookies['refreshToken'];

  if (!refreshToken) {
    return res.status(401).send('Access Denied. No refresh token provided.');
  }

  if (refreshToken) {
    try {
      const payload = parseRefreshToken(refreshToken);
      const userId = payload._id;
      const tokens = await getUserForTokenGenereating(userId);
      //   console.log(tokens);
      res.status(200).json({ tokens });
      res.end();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
  }
});
module.exports = {
  refreshTokenController,
};
