// check token from request
const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const { ERROR_ANSWERS } = require('../utils/errorAnswers');
const { DEV_ENV_OPTIONS } = require('../utils/devEnvOptions');
const { UnauthorizedError } = require('../utils/errorHandler/UnauthorizedError');

module.exports = (req, res, next) => {
  const token = req.cookies.mestoToken;
  if (!token) {
    next(new UnauthorizedError({ message: ERROR_ANSWERS.authError }));
  }

  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : DEV_ENV_OPTIONS.JWT_SECRET);
  } catch (err) {
    next(new UnauthorizedError({ message: ERROR_ANSWERS.authError }));
    return;
  }

  req.user = payload;
  next();
};
