module.exports.centralizedErrorHandler = (err, req, res, next) => {
  res.status(err.statusCode || 500).send({ message: err.message });
  next();
};
