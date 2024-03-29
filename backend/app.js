require('dotenv').config({ path: '../.env' });

const { errors } = require('celebrate');
const process = require('process');
const express = require('express');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const helmet = require('helmet');
const cors = require('cors');

const mainApiRouter = require('./routes/index');

const CORS_OPTIONS = require('./utils/corsOptions');
const { REQUEST_LIMITER_OPTIONS } = require('./utils/requestLimiterOptions');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const { centralizedErrorHandler } = require('./utils/errorHandler/centralizedErrorHandler');
const { uncaughtExceptionHandler } = require('./utils/errorHandler/uncaughtExceptionHandler');

const app = express();

app.use(cookieParser());

process.on('uncaughtException', uncaughtExceptionHandler);

app.use(cors(CORS_OPTIONS));

app.use(requestLogger);

// set lim of requests
app.use(REQUEST_LIMITER_OPTIONS);

// security
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', mainApiRouter);

app.use(errorLogger);
app.use(errors());

// message for user about some errors
app.use(centralizedErrorHandler);

module.exports = app;
