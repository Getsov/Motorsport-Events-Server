const jwt = require('jsonwebtoken');
//TODO: use env and change secret
const secret = 'q213fdfsddfasd231adfas12321kl';

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
