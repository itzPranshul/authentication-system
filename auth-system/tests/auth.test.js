const request = require('supertest');
const app = require('../app');
const db = require('../config/db');

beforeAll(async () => {
  await db.query('DELETE FROM users');
});

describe('Authentication Endpoints', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('userId');
  });

  it('should login a user and return a token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should retrieve the user profile', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${loginRes.body.token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('user');
  });
});
