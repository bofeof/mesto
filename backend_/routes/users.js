const { celebrate, Joi } = require('celebrate');
const userRouter = require('express').Router();
const {
  getAllUsers, getUserById, updateProfile, updateAvatar, getProfileInfo,
} = require('../controllers/users');

// return all users
userRouter.get('/', getAllUsers);

userRouter.get('/me', getProfileInfo);

// return user using id
userRouter.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().required().length(24)
        .hex(),
    }),
  }),
  getUserById,
);

// update profile
userRouter.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateProfile,
);

// update avatar
userRouter.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().uri().required(),
    }),
  }),
  updateAvatar,
);

module.exports = userRouter;
