// check token from request
const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const { errorAnswers } = require('../utils/constants');
const { devEnvOptions } = require('../utils/devEnvOptions');
const { UnauthorizedError } = require('../utils/errorHandler/UnauthorizedError');

module.exports = (req, res, next) => {
  const token = req.cookies.mestoToken;
  if (!token) {
    next(new UnauthorizedError({ message: errorAnswers.tokenError }));
  }

  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : devEnvOptions.JWT_SECRET);
  } catch (err) {
    next(new UnauthorizedError({ message: errorAnswers.tokenError }));
    return;
  }

  req.user = payload;
  next();
};
