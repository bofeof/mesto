const supertest = require('supertest');
const mongoose = require('mongoose');
const User = require('../models/user');
const Card = require('../models/card');

const {
  newUser, newCard, anotherCardId, invalidNameNewCard, invalidLinkNewCard, invalidCardId,
} = require('./fixtures/testData');
const app = require('../app');

const { DEV_ENV_OPTIONS } = require('../utils/devEnvOptions');

const {
  NODE_ENV = 'development',
  MONGO_URL_PROD,
  MONGO_DB_PROD,
} = process.env;

const MONGO_URL = NODE_ENV === 'production' ? MONGO_URL_PROD : DEV_ENV_OPTIONS.MONGO_URL;
const MONGO_DB = NODE_ENV === 'production' ? MONGO_DB_PROD : DEV_ENV_OPTIONS.MONGO_DB;
const { ERROR_ANSWERS } = require('../utils/errorAnswers');

let userId;
let cardId;
let token;
let cookieData;

const request = supertest(app);

// mongoose for removing user after all test
beforeAll(() => {
  mongoose.set('strictQuery', true);
  mongoose.connect(`${MONGO_URL}/${MONGO_DB}`);
});

afterAll(() => {
  mongoose.disconnect(`${MONGO_URL}/${MONGO_DB}`);
});

function getJwtToken(data) {
  return data.split(';')[0].split('=')[1];
}

// TESTS
describe('All manipulation with user: creation, updating ect', () => {
  describe('Craete new user and sign in, get token for next actions', () => {
    it('Create user with valid data, user doesnt exist', () => request
      .post('/signup')
      .send(newUser)
      .then((res) => {
        const message = JSON.parse(res.text);
        const userData = message.data;
        userId = userData._id;
        expect(res.status).toBe(200);
        expect(message).toBeDefined();
        expect(userData._id).toBeDefined();
        expect(userData.email).toContain(newUser.email);
      }));

    // sign in and get token
    it('sign in after registration and get token', () => request
      .post('/signin')
      .send(newUser)
      .then((res) => {
        cookieData = res.header['set-cookie'];
        token = `${getJwtToken(cookieData[0])}`;
        expect(res.status).toBe(200);
        expect(token).toBeDefined();
      }));
  });

  describe('After login: create card', () => {
    it('Create card: valid data, with token', () => request
      .post('/cards')
      .set('Cookie', `mestoToken=${token}`)
      .send(newCard)
      .then((res) => {
        const message = JSON.parse(res.text);
        const cardData = message.data;
        cardId = cardData._id;
        expect(res.status).toBe(200);
        expect(cardData.name).toBe(newCard.name);
        expect(cardData.owner._id).toBe(userId);
        expect(cardData.owner.email).toBe(newUser.email);
      }));

    it('Create card: invalid data(name), with token', () => request
      .post('/cards')
      .set('Cookie', `mestoToken=${token}`)
      .send(invalidNameNewCard)
      .then((res) => {
        const message = JSON.parse(res.text);
        expect(res.status).toBe(400);
        expect(message.message).toBe('Validation failed');
      }));

    it('Create card: invalid data(link), with token', () => request
      .post('/cards')
      .set('Cookie', `mestoToken=${token}`)
      .send(invalidLinkNewCard)
      .then((res) => {
        const message = JSON.parse(res.text);
        expect(res.status).toBe(400);
        expect(message.message).toBe('Validation failed');
      }));
  });

  describe('After login: like card', () => {
    it('Like card', () => request
      .put(`/cards/${cardId}/likes`)
      .set('Cookie', `mestoToken=${token}`)
      .then((res) => {
        const message = JSON.parse(res.text);
        const cardData = message.data;
        expect(res.status).toBe(200);
        // 1 like for created card
        expect(cardData.likes.length).toBeGreaterThanOrEqual(1);
      }));

    it('Like card, invalid id', () => request
      .put(`/cards/${invalidCardId + 123}/likes`)
      .set('Cookie', `mestoToken=${token}`)
      .then((res) => {
        const message = JSON.parse(res.text);
        expect(res.status).toBe(400);
        expect(message).toBeDefined();
        expect(message.message).toBe('Validation failed');
      }));

    it('Like card, card doesnt exist', () => request
      .put(`/cards/${invalidCardId}/likes`)
      .set('Cookie', `mestoToken=${token}`)
      .then((res) => {
        expect(res.status).toBe(404);
      }));
  });

  describe('After login: dislike card', () => {
    // Dislike
    it('Dislike card', () => request
      .delete(`/cards/${cardId}/likes`)
      .set('Cookie', `mestoToken=${token}`)
      .then((res) => {
        const message = JSON.parse(res.text);
        const cardData = message.data;
        expect(res.status).toBe(200);
        // 1 like for created card
        expect(cardData.likes.length).toBe(0);
      }));

    it('Dislike card, invalid id', () => request
      .delete(`/cards/${invalidCardId + 123}/likes`)
      .set('Cookie', `mestoToken=${token}`)
      .then((res) => {
        const message = JSON.parse(res.text);
        expect(res.status).toBe(400);
        expect(message).toBeDefined();
        expect(message.message).toBe('Validation failed');
      }));

    it('Dislike card, card doesnt exist', () => request
      .delete(`/cards/${invalidCardId}/likes`)
      .set('Cookie', `mestoToken=${token}`)
      .then((res) => {
        expect(res.status).toBe(404);
      }));
  });

  describe('After login: remove card', () => {
    it('Remove created card, invalid id', () => request
      .delete(`/cards/${invalidCardId + 123}`)
      .set('Cookie', `mestoToken=${token}`)
      .then((res) => {
        const message = JSON.parse(res.text);
        expect(res.status).toBe(400);
        expect(message).toBeDefined();
        expect(message.message).toBe('Validation failed');
      }));

    it('Remove created card', () => request
      .delete(`/cards/${cardId}`)
      .set('Cookie', `mestoToken=${token}`)
      .then((res) => {
        const message = JSON.parse(res.text);
        const cardData = message.data;
        cardId = cardData._id;
        expect(res.status).toBe(200);
        expect(cardData.name).toBe(newCard.name);
        expect(cardData.owner._id).toBe(userId);
        expect(cardData.owner.email).toBe(newUser.email);
      }));

    it('Remove created card again. it doesnt exist', () => request
      .delete(`/cards/${cardId}`)
      .set('Cookie', `mestoToken=${token}`)
      .then((res) => {
        expect(res.status).toBe(404);
      }));

    it('Removed card (created by another user, forbidden)', () => request
      .delete(`/cards/${anotherCardId}`)
      .set('Cookie', `mestoToken=${token}`)
      .then((res) => {
        const message = JSON.parse(res.text);
        expect(res.status).toBe(403);
        expect(message.message).toBe(ERROR_ANSWERS.forbiddenError);
      }));
  });

  describe('After login: get all gallery', () => {
    it('Get cards', () => request.get('/cards')
      .set('Cookie', `mestoToken=${token}`)
      .then((res) => {
        const message = JSON.parse(res.text);
        const galleryData = message.data;
        expect(res.status).toBe(200);
        expect(galleryData.length).toBeGreaterThanOrEqual(0);
      }));
  });

  describe('Remove user and cards', () => {
    // remove test user and cards
    // at this moment we don't have ability to remove user using api requiest
    it('Remove all cards db', () => Card.deleteMany({ owner: { _id: userId } }));
    it('Remove user from db', () => User.deleteOne({ email: newUser.email }));
  });

  describe('Invalid url, request method, crash test', () => {
    it('Check invalid url or method, example 1', () => {
      request.get('/card/123', (res) => {
        expect(res.status).toBe(404);
      });
    });

    it('Check invalid url or method, example 2', () => {
      request.get('/cards/e/aaa/xxx/123', (res) => {
        expect(res.status).toBe(404);
      });
    });

    it('Crash test', () => {
      request.get('/crash-test', (res) => {
        expect(res.status).toBe(500);
      });
    });
  });
});
