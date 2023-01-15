class UnauthorizedError extends Error {
  constructor({ message, logMessage }) {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
    this.logMessage = logMessage;
  }
}

module.exports.UnauthorizedError = UnauthorizedError;
