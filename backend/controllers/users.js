const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { DEV_ENV_OPTIONS } = require('../utils/devEnvOptions');
const { ERROR_ANSWERS } = require('../utils/errorAnswers');
const { USER_MESSAGES } = require('../utils/userMessages');

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
      if (!user) {
        next(new NotFoundError({ message: ERROR_ANSWERS.userIdError }));
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
  bcrypt.hash(password, 10).then((hash) =>
    User.create({
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
          next(
            new DublicateDataError({
              message: ERROR_ANSWERS.userExistsError,
            })
          );
          return;
        }
        if (err.name === 'ValidationError') {
          next(new ValidationError({ message: err.message }));
          return;
        }
        next(err);
      })
  );
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
    }
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
    }
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
      // jwt and cookie
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : DEV_ENV_OPTIONS.JWT_SECRET, {
        expiresIn: '7d',
      });
      res
        .cookie('mestoToken', token, {
          httpOnly: process.env.NODE_ENV === 'production',
          sameSite: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 3600000 * 24 * 7,
        })
        .json({ message: USER_MESSAGES.userLogin });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.logout = (req, res) => {
  res.clearCookie('mestoToken').status(200).json({ message: USER_MESSAGES.userLogout });
};

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
