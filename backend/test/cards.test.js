const supertest = require('supertest');
const app = require('../app');

const request = supertest(app);

// request tests for gallery/cards
describe('test request, should return 404', () => {
  it('test', () => request.get('/').then((response) => {
    expect(response.status).toBe(404);
  }));
});
