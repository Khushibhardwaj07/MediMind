// Wraps an async controller so that if it throws, the error is passed
// to our error handler instead of crashing the request.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;