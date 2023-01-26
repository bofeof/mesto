require('dotenv').config({ path: '../.env' });

const app = require('./app');

const { PORT = 3000, NODE_ENV } = process.env;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}. Environment: ${NODE_ENV}`);
});
