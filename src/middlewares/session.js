const { parseAccesToken } = require('../utils/parseToken');
module.exports = () => (req, res, next) => {
  const token = req.headers['x-authorization'];
  const path = req.path;
  if (path != '/refreshToken') {
    if (token) {
      try {
        const payload = parseAccesToken(token);
        req.requester = payload;
        req.token = token;
      } catch (error) {
        return res.status(401).json({ message: 'Invalid authorization token' });
      }
    }
  }
  next();
};
