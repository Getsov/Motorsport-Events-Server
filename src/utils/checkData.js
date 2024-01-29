const { xssRegex } = require('../shared/sharedRegex');

function checkRequestData(requestBody) {
  for (const [key, value] of Object.entries(requestBody)) {
    if (xssRegex.test(key) || xssRegex.test(value)) {
      throw new Error('Data contains forbidden characters!');
    }
  }
}

module.exports = { checkRequestData };
