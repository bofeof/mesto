const supertest = require('supertest');
const mongoose = require('mongoose');
const User = require('../models/user');
const Card = require('../models/card');

const {
  newUser,
  newCard,
  anotherCardId,
  invalidNameNewCard,
  invalidLinkNewCard,
} = require('../fixtures/testData');
const app = require('../app');

const { MONGO_DB } = process.env;
const { errorAnswers } = require('../utils/constants');

let token;
let userId;
let cardId;

const request = supertest(app);

// mongoose for removing user after all test
beforeAll(() => {
  mongoose.connect(MONGO_DB);
});

afterAll(() => {
  mongoose.disconnect(MONGO_DB);
});

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
        const message = JSON.parse(res.text);
        // get token
        token = `Bearer ${message.token}`;
        expect(res.status).toBe(200);
        expect(token).toBeDefined();
      }));
  });

  describe('User already exists: remove, try to log in if user doesnt exist', () => {
    // remove test user and cards
    // at this moment we don't have ability to remove user using api requiest
    // it('Remove all cards db', () => User.deleteMany({ owner: { _id: userId } }));
    it('Remove user from db', () => User.deleteOne({ username: newUser.email }));
  });

  describe('Invalid url, request method, crash test', () => {
    it('Check invalid url or method, example 1', () => {
      request.post('/users/me/aaa/xxx', (res) => {
        expect(res.status).toBe(404);
      });
    });

    it('Check invalid url or method, example 2', () => {
      request.delete('/users/e/aaa/xxx/123', (res) => {
        expect(res.status).toBe(404);
      });
    });

    it('Crash test', () => {
      request.delete('/crash-test', (res) => {
        expect(res.status).toBe(500);
      });
    });
  });
});
