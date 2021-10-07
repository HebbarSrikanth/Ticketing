import request from 'supertest';
import { app } from '../../app';

describe('Test Case for /api/users/signup', () => {
  it('Validation to save a user', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(201);
  });

  it('Validation for Unique Email', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(201);

    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(400);
  });

  it('Validation for email', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@testcom',
        password: '123456',
      })
      .expect(400);
  });

  it('Validation for password', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: '',
      })
      .expect(400);

    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: '123',
      })
      .expect(400);
  });

  it('Validation if email && password are missing', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: '',
        password: '',
      })
      .expect(400);
  });
});
