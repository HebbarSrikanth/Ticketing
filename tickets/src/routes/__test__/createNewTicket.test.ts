import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/tickets';
import { natsWrapper } from '../../natsWrapper';

describe('Test case for creating a new ticket in ticket service', () => {
  it('Checking if there is a route handler for /api/tickets api', async () => {
    const res = await request(app).post('/api/tickets').send({});

    expect(res.statusCode).not.toEqual(404);
  });

  it('if the user is not authrorized then throw unauthorized error', async () => {
    const res = await request(app).post('/api/tickets').send({});

    expect(res.statusCode).toEqual(401);
  });

  it('if user is authorized then successful for creating a post', async () => {
    const cookie = global.signin();
    const res = await request(app).post('/api/tickets').set('Cookie', cookie).send({});
    expect(res.status).not.toEqual(401);
  });

  it('if there is no title in the body', async () => {
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({
        price: 10,
      })
      .expect(400);

    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({
        title: '',
        price: 10,
      })
      .expect(400);
  });

  it('if the price is not provided', async () => {
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({
        title: '',
      })
      .expect(400);

    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({
        title: 'asfdf',
        price: -10,
      })
      .expect(400);
  });

  it('Successfully posted the ticket', async () => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    const title = 'Ticket-1';

    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({
        title,
        price: 100,
      })
      .expect(201);

    tickets = await Ticket.find({});
    expect(tickets[0].title).toEqual(title);
    expect(tickets[0].price).toEqual('100');
  });

  it('Publish event is called after creating of a ticket', async () => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    const title = 'Ticket-1';

    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({
        title,
        price: 100,
      })
      .expect(201);

    tickets = await Ticket.find({});
    expect(tickets[0].title).toEqual(title);
    expect(tickets[0].price).toEqual('100');

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
