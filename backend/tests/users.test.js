const supertest = require('supertest');
const mongoose = require('mongoose');
const User = require('../models/user');
const {
  newUser,
  invalidUserId,
  invalidNewUser,
  newUserInfo,
  newUserAvatar,
  invalidUserInfo,
  invalidUserAvatar,
} = require('./fixtures/testData');
const app = require('../app');

const { DEV_ENV_OPTIONS } = require('../utils/devEnvOptions');

const { NODE_ENV = 'development', MONGO_URL_PROD, MONGO_DB_PROD } = process.env;

const MONGO_URL = NODE_ENV === 'production' ? MONGO_URL_PROD : DEV_ENV_OPTIONS.MONGO_URL;
const MONGO_DB = NODE_ENV === 'production' ? MONGO_DB_PROD : DEV_ENV_OPTIONS.MONGO_DB;
const { ERROR_ANSWERS } = require('../utils/errorAnswers');

let userId;
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
        cookieData = res.header['set-cookie'];
        token = `${getJwtToken(cookieData[0])}`;
        expect(res.status).toBe(200);
        expect(token).toBeDefined();
      }));
  });

  describe('User manipulation after sign in (with token)', () => {
    describe('Get current user or user by Id after sign in', () => {
      it('Get user by invaid id', () => {
        request
          .get(`/users/${invalidUserId}`)
          .set('Cookie', `mestoToken=${token}`)
          .then((res) => {
            const message = JSON.parse(res.text);
            expect(res.status).toBe(400);
            expect(message.message).toBe('Validation failed');
          });
      });

      it('Get user by id', () => {
        request
          .get(`/users/${userId}`)
          .set('Cookie', `mestoToken=${token}`)
          .then((res) => {
            const message = JSON.parse(res.text);
            const userData = message.data;
            expect(res.status).toBe(200);
            expect(userData.email).toBe(newUser.email);
          });
      });

      it('Get current user', () => {
        request
          .get('/users/me')
          .set('Cookie', `mestoToken=${token}`)
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
          // .set('Cookie', ``)
          .then((res) => {
            const message = JSON.parse(res.text);
            expect(res.status).toBe(401);
            expect(message).toStrictEqual({
              message: ERROR_ANSWERS.authError,
            });
          });
      });
    });

    describe('Change user data: info with valid and invalid data and token', () => {
      it('Change user info(name and about) after login, token is valid', () => {
        request
          .patch('/users/me')
          .set('Cookie', `mestoToken=${token}`)
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
          .set('Cookie', '')
          .send(newUserInfo)
          .then((res) => {
            const message = JSON.parse(res.text);
            expect(res.status).toBe(401);
            expect(message).toStrictEqual({
              message: ERROR_ANSWERS.authError,
            });
          });
      });

      it('Change user info(name and about) after login, invalid data, valid token', () => {
        request
          .patch('/users/me')
          .set('Cookie', `mestoToken=${token}`)
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
          .set('Cookie', `mestoToken=${token}`)
          .send(newUserAvatar)
          .then((res) => {
            const message = JSON.parse(res.text);
            const userData = message.data;
            expect(res.status).toBe(200);
            expect(userData.avatar).toBe(newUserAvatar.avatar);
          });
      });

      it('Change user avatar after login, no token', () => {
        request
          .patch('/users/me/avatar')
          .send(newUserAvatar)
          .then((res) => {
            const message = JSON.parse(res.text);
            expect(res.status).toBe(401);
            expect(message).toStrictEqual({
              message: ERROR_ANSWERS.authError,
            });
          });
      });

      it('Change user avatar after login, invalid data, valid token', () => {
        request
          .patch('/users/me/avatar')
          .set('Cookie', `mestoToken=${token}`)
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
          message: ERROR_ANSWERS.userExistsError,
        });
      }));

    // remove test user
    // at this moment we don't have ability to remove user using api requiest
    it('Remove user from db', () => User.deleteOne({ email: newUser.email }));

    // try to sign in again => user doesnt exist
    it('User doesnt exist', () => request
      .post('/signin')
      .send(newUser)
      .then((res) => {
        expect(res.status).toBe(401);
        const message = JSON.parse(res.text);
        expect(message).toStrictEqual({
          message: ERROR_ANSWERS.wrongEmailPassword,
        });
      }));
  });

  describe('Invalid url, request method, crash test', () => {
    it('Check invalid url or method, example 1', () => {
      request.get('/users/me/aaa/xxx', (res) => {
        expect(res.status).toBe(404);
      });
    });

    it('Check invalid url or method, example 2', () => {
      request.get('/users/e/aaa/xxx/123', (res) => {
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
