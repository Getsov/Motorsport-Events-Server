const refreshTokenController = require('express').Router();
const { getUserForTokenGenereating } = require('../services/userService');
const { parseRefreshToken } = require('../utils/parseToken');

refreshTokenController.post('/', async (req, res) => {
  const refreshtoken = req.body.refreshToken;
  if (refreshtoken) {
    try {
      const payload = parseRefreshToken(refreshtoken);
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
