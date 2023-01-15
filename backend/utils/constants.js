// messages for user
const errorAnswers = {
  userIdError: 'Невозможно найти пользователя, не существует в базе',
  userExistsError: 'Невозможно зарегистрировать пользователя: email уже использовался для регистрации',
  removingCardError: 'Карточка с заданными параметрами не найдена в базе. Невозможно удалить карточку.',
  settingLikeError: 'Карточка с заданными параметрами не найдена в базе. Невозможно поставить лайк.',
  removingLikeError: 'Карточка с заданными параметрами не найдена в базе. Невозможно снять лайк',
  authError: 'Необходима авторизация',
  routeError: 'Ошибка маршрутизации',
  tokenError: 'Ошибка с токеном авторизации',
  forbiddenError: 'Недостаточно прав для совершения действия',
  wrongEmailPassword: 'Невозможно войти в Mesto: введены неверные почта и пароль',
};
const logFile = 'logs/Logs.log';

module.exports.errorAnswers = errorAnswers;
module.exports.logFile = logFile;
