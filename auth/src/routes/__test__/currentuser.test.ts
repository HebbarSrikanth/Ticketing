import request from 'supertest';
import { app } from '../../app';

describe('Test case for /api/users/currentuser', () => {
  it('Validation to get the user details', async () => {
    const cookie = await global.signin();

    const res = await request(app)
      .get('/api/users/currentuser')
      .set('Cookie', cookie)
      .send()
      .expect(200);

    expect(res.body.currentUser['email']).toEqual('test@test.com');
  });

  it('Validate if the user is not authenticated', async () => {
    const res = await request(app).get('/api/users/currentuser').send().expect(200);

    expect(res.body.currentUser).toEqual(null);
  });
});
