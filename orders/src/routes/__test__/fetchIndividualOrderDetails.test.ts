import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Ticket } from '../../models/tickets';

describe('Test case for fetching the details of Individual order', () => {
  it('Return 401 if the user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app).get(`/api/orders/${id}`).expect(401);
  });

  it('Return 400 if the userid is not in the proper mongo id format', async () => {
    await request(app).get('/api/orders/12345600').set('Cookie', global.signin()).expect(400);
  });

  it('Return 404 if the order is not present', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app).get(`/api/orders/${id}`).set('Cookie', global.signin()).expect(404);
  });

  it('Return 401 if different user try to access the order details', async () => {
    const ticket = Ticket.build({
      price: 120,
      title: 'Ticket',
      id: new mongoose.Types.ObjectId().toHexString(),
    });
    await ticket.save();

    const res = await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin())
      .send({
        ticketId: ticket.id,
      })
      .expect(201);

    await request(app).get(`/api/orders/${res.body.id}`).set('Cookie', global.signin()).expect(401);
  });

  it('Return the order details for the user', async () => {
    const title = 'Ticket';
    const ticket = Ticket.build({
      price: 120,
      title,
      id: new mongoose.Types.ObjectId().toHexString(),
    });
    await ticket.save();

    const cookie = global.signin();
    const res = await request(app)
      .post('/api/orders')
      .set('Cookie', cookie)
      .send({
        ticketId: ticket.id,
      })
      .expect(201);

    const orderDetails = await request(app).get(`/api/orders/${res.body.id}`).set('Cookie', cookie);

    expect(orderDetails.body.ticket.title).toEqual(title);
    expect(orderDetails.body.ticket.price).toEqual(120);
  });
});
