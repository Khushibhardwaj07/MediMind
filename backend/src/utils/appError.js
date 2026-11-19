// An error we THROW ON PURPOSE, with a status code and a safe message
// that is OK to show to the user (like "Invalid email or password").
// Any other error is treated as a bug and hidden from the client.
class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

module.exports = AppError;