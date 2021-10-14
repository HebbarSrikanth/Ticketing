import request from 'supertest';
import { app } from '../../../app';
import mongoose from 'mongoose';
import { Ticket } from '../../models/tickets';
import { Order } from '../../models/orders';

describe('Test case for creating a new Order', () => {
  it('Return 401 if the user is not authenticated', async () => {
    await request(app).post('/api/orders').send().expect(401);
  });

  it('Return 400 bad request error if the ticket is not provided', async () => {
    //Empty ticketId
    await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin())
      .send({ ticketId: '' })
      .expect(400);

    //Nothing is sent in the body
    await request(app).post('/api/orders').set('Cookie', global.signin()).send({}).expect(400);

    //Ticket id is not in proper format
    await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin())
      .send({
        ticketId: 'dssafdsa',
      })
      .expect(400);
  });

  it('Return 404 if the ticket is not present in the db', async () => {
    const ticketId = new mongoose.Types.ObjectId().toHexString();
    await request(app)
      .post('/api/orders')
      .send({
        ticketId,
      })
      .set('Cookie', global.signin())
      .expect(404);
  });

  it('Return 400 if the ticket the user is trying to order is already reserved', async () => {
    //Create an order then try to access the same ticket
    const ticket = Ticket.build({
      title: 'Ticket - 1',
      price: 120,
    });
    await ticket.save();

    const res = await request(app)
      .post('/api/orders')
      .send({ ticketId: ticket.id })
      .set('Cookie', global.signin());

    expect(res.status).toEqual(201);

    await request(app)
      .post('/api/orders')
      .send({
        ticketId: ticket.id,
      })
      .set('Cookie', global.signin())
      .expect(400);
  });

  it('Successfully save the order', async () => {
    let tickets = await Ticket.find({});
    let orders = await Order.find({});

    const ticket = Ticket.build({
      title: 'Ticket - 1',
      price: 120,
    });
    await ticket.save();

    const res = await request(app)
      .post('/api/orders')
      .send({ ticketId: ticket.id })
      .set('Cookie', global.signin());

    tickets = await Ticket.find({});
    orders = await Order.find({});

    expect(res.status).toEqual(201);
    expect(tickets.length).toEqual(1);
    expect(orders.length).toEqual(1);
  });
});
