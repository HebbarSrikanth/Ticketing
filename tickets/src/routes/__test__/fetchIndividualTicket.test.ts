import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';

describe('Test case for Individual ticket details', () => {
  it('if ticket of the id is not present', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app).get(`/api/tickets/${id}`).expect(404);
  });

  it('Valid ticket is availbale then show its details', async () => {
    const title = 'Ticket - 1';
    const res = await request(app)
      .post('/api/tickets')
      .send({
        title,
        price: 100,
      })
      .set('Cookie', global.signin());

    const getRes = await request(app).get(`/api/tickets/${res.body.id}`);

    expect(getRes.body.price).toEqual(res.body.price);
    expect(getRes.body.title).toEqual(res.body.title);
  });
});
