const { customAlphabet } = require('nanoid');

// Generate 7 character IDs with letters and digits
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 7);

function generateShortCode() {
  return nanoid();
}

module.exports = { generateShortCode };
