require('dotenv').config({ path: '../.env' });
const console = require('console');
const mongoose = require('mongoose');

const myConsole = new console.Console(process.stdout, process.stderr);

const app = require('./app');

const {
  PORT = 3000, NODE_ENV, MONGO_DB, MONGO_URL,
} = process.env;

mongoose.connect(`${MONGO_URL}/${MONGO_DB}`);

app.listen(PORT, () => {
  myConsole.log(`App listening on port ${PORT}. Environment: ${NODE_ENV}`);
});
