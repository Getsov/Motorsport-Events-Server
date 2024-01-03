const crypto = require('crypto');

// Function to generate a random temporary password
function generatePassword(length = 6) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const passwordArray = new Array(length);
  const randomBytes = crypto.randomBytes(length);

  for (let i = 0; i < length; i++) {
    const byte = randomBytes.readUInt8(i);
    passwordArray[i] = characters[byte % characters.length];
  }

  return passwordArray.join('');
}

module.exports = {
  generatePassword,
};
