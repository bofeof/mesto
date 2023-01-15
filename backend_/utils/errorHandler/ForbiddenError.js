class ForbiddenError extends Error {
  constructor({ message, logMessage }) {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = 403;
    this.logMessage = logMessage;
  }
}

module.exports.ForbiddenError = ForbiddenError;
