const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.AUTH_TOKEN_SECRET;
function parseToken(token) {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error('Invalid acces token!');
  }
}

module.exports = {
  parseToken,
  secret,
};
