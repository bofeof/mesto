const { NotFoundError } = require('./NotFoundError');
const { errorAnswers } = require('../constants');

module.exports.wrongRouteErrorHandler = (req, res, next) => {
  next(new NotFoundError({
    message: errorAnswers.routeError,
  }));
};
