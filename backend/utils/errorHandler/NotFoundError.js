class NotFoundError extends Error {
  constructor({ message, logMessage }) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
    this.logMessage = logMessage;
  }
}

module.exports.NotFoundError = NotFoundError;
