// Runs AFTER authenticate. Lets the request through only if the user's role
// is in the allowed list. Example: authorize('admin') or authorize('doctor', 'admin').
const AppError = require('../utils/appError');

const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return next(new AppError(401, 'Authentication required'));
  }

  if (!allowedRoles.includes(req.user.role)) {
    return next(new AppError(403, 'You do not have permission to do this'));
  }

  return next();
};

module.exports = authorize;