class DublicateDataError extends Error {
  constructor({ message, logMessage }) {
    super(message);
    this.name = 'UserExists';
    this.statusCode = 409;
    this.logMessage = logMessage;
  }
}

module.exports.DublicateDataError = DublicateDataError;
