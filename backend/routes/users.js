const userRouter = require('express').Router();

const {
  getUserValidation,
  updateUserValidation,
  updateAvatarValidation,
} = require('../utils/celebrateValidation');

const {
  getAllUsers, getUserById, updateProfile, updateAvatar, getProfileInfo,
} = require('../controllers/users');

// return all users
userRouter.get('/', getAllUsers);

userRouter.get('/me', getProfileInfo);

// return user using id
userRouter.get(
  '/:userId',
  getUserValidation,
  getUserById,
);

// update profile
userRouter.patch(
  '/me',
  updateUserValidation,
  updateProfile,
);

// update avatar
userRouter.patch(
  '/me/avatar',
  updateAvatarValidation,
  updateAvatar,
);

module.exports = userRouter;
