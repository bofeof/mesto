const cardRouter = require('express').Router();

const {
  createCardValidation,
  deleteCardValidation,
  likeCardValidation,
  dislikeCardValidation,
} = require('../utils/celebrateValidation');

const { getAllCards, createCard, deleteCardbyId, likeCard, dislikeCard } = require('../controllers/cards');

cardRouter.get('/', getAllCards);

cardRouter.post('/', createCardValidation, createCard);

cardRouter.delete('/:cardId', deleteCardValidation, deleteCardbyId);

cardRouter.put('/:cardId/likes', likeCardValidation, likeCard);
cardRouter.delete('/:cardId/likes', dislikeCardValidation, dislikeCard);

module.exports = cardRouter;
