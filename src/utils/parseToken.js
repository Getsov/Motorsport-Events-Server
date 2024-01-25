const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.AUTH_TOKEN_SECRET;
console.log(secret);
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
