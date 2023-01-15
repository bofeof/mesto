class UnknownError extends Error {
  constructor({ message, logMessage }) {
    super(message);
    this.name = 'UnknownError';
    this.statusCode = 500;
    this.logMessage = logMessage;
  }
}

module.exports.UnknownError = UnknownError;
