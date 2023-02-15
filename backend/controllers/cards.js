const Card = require('../models/card');
const { errorAnswers } = require('../utils/constants');
const { NotFoundError } = require('../utils/errorHandler/NotFoundError');
const { ForbiddenError } = require('../utils/errorHandler/ForbiddenError');
const { ValidationError } = require('../utils/errorHandler/ValidationError');

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .sort({ createdAt: 'desc' })
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      next(err);
    });
};

module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => {
      Card.findById(card._id).populate(['owner', 'likes'])
        .then((data) => {
          if (!data) {
            next(new NotFoundError({ message: errorAnswers.cardIdError }));
          }
          // send created card
          res.send({ data });
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError({ message: err.message }));
        return;
      }
      next(err);
    });
};

module.exports.deleteCardbyId = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  // check if card exists and check owner
  Card.findById(cardId)
    .then(async (card) => {
      if (!card) {
        next(new NotFoundError({ message: errorAnswers.removingCardError }));
        return;
      }
      // card exists
      const ownerCardId = card.owner._id.toString();
      if (userId !== ownerCardId) {
        next(new ForbiddenError({ message: errorAnswers.forbiddenError }));
        return;
      }

      try {
        const removingCard = await Card.findByIdAndRemove(cardId).populate(['owner', 'likes']);
        res.send({ data: removingCard });
      } catch (err) {
        next(err);
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => {
      // correct id but doesnt exist in db
      if (!card) {
        next(new NotFoundError({ message: errorAnswers.settingLikeError }));
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => {
      // correct id but doesnt exist in db
      if (!card) {
        next(new NotFoundError({ message: errorAnswers.removingLikeError }));
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      next(err);
    });
};
