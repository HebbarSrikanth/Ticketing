import request from 'supertest';
import { app } from '../../app';

describe('Test case for api/users/signin', () => {
  it('Validation if both the email && password is not present', async () => {
    await request(app)
      .post('/api/users/signin')
      .send({
        email: '',
        password: '',
      })
      .expect(400);
  });

  it('Validation if email is present and not the password', async () => {
    await request(app)
      .post('/api/users/signin')
      .send({
        email: 'test@test.com',
        password: '',
      })
      .expect(400);
  });

  it('Validation if proper email is not provided', async () => {
    await request(app)
      .post('/api/users/signin')
      .send({
        email: '',
        password: '123456',
      })
      .expect(400);
  });

  it('Validation if the user email is not present', async () => {
    await request(app)
      .post('/api/users/signin')
      .send({
        email: 'test@test.com',
        password: '',
      })
      .expect(400);
  });

  it('Validation if the password is mismatched', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'root@123',
      })
      .expect(201);

    await request(app)
      .post('/api/users/signin')
      .send({
        email: 'test@test.com',
        password: 'root123',
      })
      .expect(400);
  });

  it('Validation if the cookie is set after the successful signin', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'root@123',
      })
      .expect(201);

    const res = await request(app)
      .post('/api/users/signin')
      .send({
        email: 'test@test.com',
        password: 'root@123',
      })
      .expect(200);

    expect(res.get('Set-Cookie')).toBeDefined();
  });
});
