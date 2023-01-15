const { celebrate, Joi } = require('celebrate');
const cardRouter = require('express').Router();
const {
  getAllCards, createCard, deleteCardbyId, likeCard, dislikeCard,
} = require('../controllers/cards');

cardRouter.get('/', getAllCards);

cardRouter.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().uri().required(),
    }),
  }),
  createCard,
);

cardRouter.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().length(24)
        .hex(),
    }),
  }),
  deleteCardbyId,
);

cardRouter.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().length(24)
        .hex(),
    }),
  }),
  likeCard,
);
cardRouter.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().length(24)
        .hex(),
    }),
  }),
  dislikeCard,
);

module.exports = cardRouter;
