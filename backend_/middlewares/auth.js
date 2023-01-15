// check token from request
const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const { errorAnswers } = require('../utils/constants');

const { UnauthorizedError } = require('../utils/errorHandler/UnauthorizedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError({ message: errorAnswers.authError }));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new UnauthorizedError({ message: errorAnswers.tokenError }));
    return;
  }

  req.user = payload;
  next();
};
