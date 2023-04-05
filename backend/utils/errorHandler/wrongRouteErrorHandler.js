const { NotFoundError } = require('./NotFoundError');
const { ERROR_ANSWERS } = require('../errorAnswers');

module.exports.wrongRouteErrorHandler = (req, res, next) => {
  next(new NotFoundError({
    message: ERROR_ANSWERS.routeError,
  }));
};
