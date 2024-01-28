const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretAccesToken = process.env.AUTH_TOKEN_SECRET;
const secretRefreshToken = process.env.REFRESH_TOKEN_SECRET;

function parseAccesToken(token) {
  try {
    return jwt.verify(token, secretAccesToken);
  } catch (error) {
    throw new Error('Invalid acces token!');
  }
}

function parseRefreshToken(token) {
  console.log('token');
  try {
    console.log('token');
    return jwt.verify(token, secretRefreshToken);
  } catch (error) {
    throw new Error('Invalid refresh token!');
  }
}

module.exports = {
  secretAccesToken,
  secretRefreshToken,
  parseAccesToken,
  parseRefreshToken,
};
