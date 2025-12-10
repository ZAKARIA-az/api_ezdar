const jwt = require('jsonwebtoken');

function generateToken(user) {
  const payload = { id: user._id || user.id, email: user.email };
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not set in .env');
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(payload, secret, { expiresIn });
}

module.exports = generateToken;