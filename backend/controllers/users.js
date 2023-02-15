const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { devEnvOptions } = require('../utils/devEnvOptions');
const { errorAnswers } = require('../utils/constants');

const { DublicateDataError } = require('../utils/errorHandler/DublicateDataError');
const { NotFoundError } = require('../utils/errorHandler/NotFoundError');
const { ValidationError } = require('../utils/errorHandler/ValidationError');

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      next(err);
    });
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      // correct id but doesnt exist in db
      if (!user) {
        next(new NotFoundError({ message: errorAnswers.userIdError }));
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const { password } = req.body;
  bcrypt.hash(password, 10).then((hash) => User.create({
    ...req.body,
    password: hash,
  })
    .then((user) => {
      User.findById(user._id)
        .then((newUser) => {
          res.send({ data: newUser });
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      // check 11000, user already exists
      if (err.code === 11000) {
        next(new DublicateDataError({
          message: errorAnswers.userExistsError,
        }));
        return;
      }
      if (err.name === 'ValidationError') {
        next(new ValidationError({ message: err.message }));
        return;
      }
      next(err);
    }));
};

module.exports.updateProfile = (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    userId,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    userId,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError({ message: err.message }));
        return;
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      // create jwt
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : devEnvOptions.JWT_SECRET, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};

// get data about active user
module.exports.getProfileInfo = (req, res, next) => {
  const currentUserId = req.user._id;
  User.findById(currentUserId)
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      next(err);
    });
};
