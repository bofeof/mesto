class ValidationError extends Error {
  constructor({ message, logMessage }) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.logMessage = logMessage;
  }
}

module.exports.ValidationError = ValidationError;
