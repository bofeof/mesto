const mainApiRouter = require('express').Router();

const { wrongRouteErrorHandler } = require('../utils/errorHandler/wrongRouteErrorHandler');

const userRouter = require('./users');
const cardRouter = require('./cards');
const auth = require('../middlewares/auth');

const { login, createUser, logout } = require('../controllers/users');
const { signinValidation, signupValidation } = require('../utils/celebrateValidation');

mainApiRouter.post('/signin', signinValidation, login);
mainApiRouter.post('/signout', logout);
mainApiRouter.post('/signup', signupValidation, createUser);
mainApiRouter.use('/users', auth, userRouter);
mainApiRouter.use('/cards', auth, cardRouter);

mainApiRouter.use('/', auth, wrongRouteErrorHandler);

mainApiRouter.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

module.exports = mainApiRouter;
