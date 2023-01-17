require('dotenv').config({ path: '../.env' });

const { errors, celebrate, Joi } = require('celebrate');
const process = require('process');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');

const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { errorAnswers } = require('./utils/constants');

const { PORT = 3000, NODE_ENV, MONGO_DB } = process.env;

const app = express();

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { UnknownError } = require('./utils/errorHandler/UnknownError');
const { NotFoundError } = require('./utils/errorHandler/NotFoundError');

const { login, createUser } = require('./controllers/users');

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 2000, // 200 reqs per 5 min
  standardHeaders: true,
  legacyHeaders: false,
});

process.on('uncaughtException', (err, origin) => {
  const error = new UnknownError({
    message: `${origin} ${err.name} c текстом ${err.message} не была обработана. Обратите внимание!`,
    logMessage: `${origin} ${err.name} c текстом ${err.message} не была обработана. Обратите внимание!`,
  });
  // eslint-disable-next-line no-console
  console.log(`Непредвиденная ошибка! ${error.message}`);
});

mongoose.connect(MONGO_DB);

// cors
const corsOption = {
  origin: '*',
};
app.use(cors(corsOption));

app.use(requestLogger);

// set lim of requests
app.use(limiter);

// security
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/crash-test', cors(corsOption), () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post(
  '/signin',
  cors(corsOption),
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

app.post(
  '/signup',
  cors(corsOption),
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().uri(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);

app.use((req, res, next) => {
  next(new NotFoundError({
    message: errorAnswers.routeError,
  }));
});

app.use(errorLogger);
app.use(errors());

// message for user about some errors
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send({ message: err.message });
  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}. Environment: ${NODE_ENV}`);
});
