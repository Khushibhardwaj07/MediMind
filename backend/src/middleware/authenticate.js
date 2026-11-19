// The "security guard": checks the access token on protected routes.
// If the token is valid, it attaches the user's id and role to req.user.
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const AppError = require('../utils/appError');

const authenticate = (req, res, next) => {
  // The client sends:  Authorization: Bearer <token>
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new AppError(401, 'Authentication required'));
  }

  try {
    // We pin the algorithm so an attacker can't trick us with a weaker one.
    const payload = jwt.verify(token, config.jwt.accessSecret, { algorithms: ['HS256'] });
    req.user = { id: payload.sub, role: payload.role };
    return next();
  } catch (err) {
    // Same message for expired, tampered or malformed tokens: we reveal nothing extra.
    return next(new AppError(401, 'Invalid or expired token'));
  }
};

module.exports = authenticate;