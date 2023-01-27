const supertest = require('supertest');
const mongoose = require('mongoose');
const User = require('../models/user');
const {
  newUser,
  invalidNewUser,
  newUserInfo,
  newUserAvatar,
  invalidUserInfo,
  invalidUserAvatar,
} = require('../fixtures/testData');
const app = require('../app');

const { MONGO_DB } = process.env;
const { errorAnswers } = require('../utils/constants');

let token;
let userId;

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
    it('Create user with invalid data, user doesnt exist', () => request
      .post('/signup')
      .send(invalidNewUser)
      .then((res) => {
        const message = JSON.parse(res.text);
        expect(res.status).toBe(400);
        expect(message).toBeDefined();
        expect(message.message).toBe('Validation failed');
        // joi message example
        expect(message.validation.body.message).toBe('"email" must be a valid email');
      }));

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
        token = `Bearer ${message.token}`;
        expect(res.status).toBe(200);
        expect(token).toBeDefined();
      }));
  });

  describe('User manipulation after sign in', () => {
    describe('Get current user or user by Id after sign in', () => {
      it('Get user by id', () => {
        request
          .get('/users')
          .query(userId)
          .set('Authorization', token)
          .then((res) => {
            const message = JSON.parse(res.text);
            const userData = message.data;
            expect(res.status).toBe(200);
            expect(userData.name).toBe(newUser.name);
            expect(userData.about).toBe(newUser.about);
          });
      });

      it('Get current user', () => {
        request
          .get('/users/me')
          .set('Authorization', token)
          .then((res) => {
            const message = JSON.parse(res.text);
            const userData = message.data;
            expect(res.status).toBe(200);
            expect(userData._id).toBe(userId);
          });
      });

      it('Get current user, wrong token', () => {
        request
          .get('/users/me')
          .set('Authorization', '')
          .then((res) => {
            const message = JSON.parse(res.text);
            expect(res.status).toBe(401);
            expect(message).toStrictEqual({
              message: errorAnswers.authError,
            });
          });
      });
    });

    describe('Change user data: info with valid and invalid data and token', () => {
      it('Change user info(name and about) after login, token is valid', () => {
        request
          .patch('/users/me')
          .set('Authorization', token)
          .send(newUserInfo)
          .then((res) => {
            const message = JSON.parse(res.text);
            const userData = message.data;
            expect(res.status).toBe(200);
            expect(userData.name).toBe(newUserInfo.name);
            expect(userData.about).toBe(newUserInfo.about);
          });
      });

      it('Change user info(name and about) after login, token is invalid => auth error', () => {
        request
          .patch('/users/me')
          .set('Authorization', '')
          .send(newUserInfo)
          .then((res) => {
            const message = JSON.parse(res.text);
            expect(res.status).toBe(401);
            expect(message).toStrictEqual({
              message: errorAnswers.authError,
            });
          });
      });

      it('Change user info(name and about) after login, invalid data, valid token', () => {
        request
          .patch('/users/me')
          .set('Authorization', token)
          .send(invalidUserInfo)
          .then((res) => {
            const message = JSON.parse(res.text);
            expect(res.status).toBe(400);
            expect(message.message).toBe('Validation failed');
          });
      });
    });

    describe('Change user data: avatar with valid and invalid data and token', () => {
      it('Change user avatar after login, token is valid', () => {
        request
          .patch('/users/me/avatar')
          .set('Authorization', token)
          .send(newUserAvatar)
          .then((res) => {
            const message = JSON.parse(res.text);
            const userData = message.data;
            expect(res.status).toBe(200);
            expect(userData.avatar).toBe(newUserAvatar.avatar);
          });
      });

      it('Change user avatar after login, token is invalid => auth error', () => {
        request
          .patch('/users/me/avatar')
          .set('Authorization', '')
          .send(newUserAvatar)
          .then((res) => {
            const message = JSON.parse(res.text);
            expect(res.status).toBe(401);
            expect(message).toStrictEqual({
              message: errorAnswers.authError,
            });
          });
      });

      it('Change user avatar after login, invalid data, valid token', () => {
        request
          .patch('/users/me/avatar')
          .set('Authorization', token)
          .send(invalidUserAvatar)
          .then((res) => {
            const message = JSON.parse(res.text);
            expect(res.status).toBe(400);
            expect(message.message).toBe('Validation failed');
            // joi message example
            expect(message.validation.body.message).toBe('"avatar" must be a valid uri');
          });
      });
    });
  });

  describe('User already exists: remove, try to log in if user doesnt exist', () => {
    it('User already exists, user cant sign up', () => request
      .post('/signup')
      .send(newUser)
      .then((res) => {
        expect(res.status).toBe(409);
        const message = JSON.parse(res.text);
        expect(message).toStrictEqual({
          message: errorAnswers.userExistsError,
        });
      }));

    // remove test user
    // at this moment we don't have ability to remove user using api requiest
    it('Remove user from db', () => User.deleteOne({ username: newUser.email }));

    // try to sign in again => user doesnt exist
    it('User doesnt exist', () => request
      .post('/signin')
      .send(newUser)
      .then((res) => {
        expect(res.status).toBe(401);
        const message = JSON.parse(res.text);
        expect(message).toStrictEqual({
          message: errorAnswers.wrongEmailPassword,
        });
      }));
  });

  describe('Invalid url, request method', () => {
    it('check invalid url or method, example 1', () => {
      request.post('/users/me/aaa/xxx', (res) => {
        expect(res.status).toBe(404);
      });
    });

    it('check invalid url or method, example 2', () => {
      request.delete('/users/me/aaa/xxx', (res) => {
        expect(res.status).toBe(404);
      });
    });
  });
});
