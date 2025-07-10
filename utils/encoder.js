const base64url = require('base64url');

const encodeShortCode = ({ entityType, entityId, userId }) => {
  const payload = JSON.stringify({ entityType, entityId, userId });
  return base64url.encode(payload); // URL-safe base64
};

const decodeShortCode = (shortCode) => {
  const decoded = base64url.decode(shortCode);
  return JSON.parse(decoded);
};

module.exports = { encodeShortCode, decodeShortCode };
