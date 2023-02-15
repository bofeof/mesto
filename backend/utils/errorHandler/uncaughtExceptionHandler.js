const console = require('console');
const { UnknownError } = require('./UnknownError');

const myConsole = new console.Console(process.stdout, process.stderr);

module.exports.uncaughtException = (err, origin) => {
  const error = new UnknownError({
    message: `${origin} ${err.name} c текстом ${err.message} не была обработана. Обратите внимание!`,
    logMessage: `${origin} ${err.name} c текстом ${err.message} не была обработана. Обратите внимание!`,
  });
  myConsole.log(`Непредвиденная ошибка! ${error.message}`);
};
