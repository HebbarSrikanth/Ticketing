import request from 'supertest';
import { app } from '../../app';

describe('Test Case for api/users/signout', () => {
  it('Validation to check the cookie is deleted after singout', async () => {
    const res = await request(app).post('/api/users/signout').expect(200);

    expect(res.get('Set-Cookie')[0]).toEqual(
      'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
    );
  });
});
