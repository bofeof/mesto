require('dotenv').config({ path: '../.env' });
const console = require('console');
const mongoose = require('mongoose');

const myConsole = new console.Console(process.stdout, process.stderr);

const { DEV_ENV_OPTIONS } = require('./utils/devEnvOptions');

const app = require('./app');

const {
  NODE_ENV = 'development', MONGO_URL_PROD, MONGO_DB_PROD, PORT_PROD,
} = process.env;

const PORT = NODE_ENV === 'production' ? PORT_PROD : DEV_ENV_OPTIONS.PORT;
const MONGO_URL = NODE_ENV === 'production' ? MONGO_URL_PROD : DEV_ENV_OPTIONS.MONGO_URL;
const MONGO_DB = NODE_ENV === 'production' ? MONGO_DB_PROD : DEV_ENV_OPTIONS.MONGO_DB;

mongoose.set('strictQuery', true);
mongoose.connect(`${MONGO_URL}/${MONGO_DB}`, () => {
  myConsole.log(`Connected to MongoDB. Database: ${MONGO_DB}`);
});

app.listen(PORT, () => {
  myConsole.log(`App listening on port ${PORT}. Environment: ${NODE_ENV}`);
});
