import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/orders';
import { Ticket } from '../../models/tickets';

const createTicket = async () => {
  const ticket = Ticket.build({
    title: 'Ticket',
    price: 100,
  });
  await ticket.save();
  return ticket;
};

describe('Test cases to fetch all the orders of the user', () => {
  it('Throw 401 is the user is authenticated', async () => {
    await request(app).get('/api/orders').expect(401);
  });

  it('Fetch all orders of the user', async () => {
    let orders = await Order.find({});
    //Create three tickets
    const ticket1 = await createTicket();
    const ticket2 = await createTicket();
    const ticket3 = await createTicket();

    const user1Response = await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin())
      .send({
        ticketId: ticket1.id,
      })
      .expect(201);

    const user2Cookie = global.signin();

    const user2Response1 = await request(app)
      .post('/api/orders')
      .set('Cookie', user2Cookie)
      .send({
        ticketId: ticket2.id,
      })
      .expect(201);

    const user2Response2 = await request(app)
      .post('/api/orders')
      .set('Cookie', user2Cookie)
      .send({
        ticketId: ticket3.id,
      })
      .expect(201);

    const res = await request(app).get('/api/orders').set('Cookie', user2Cookie);

    orders = await Order.find({});
    expect(res.status).toEqual(200);
    expect(res.body.length).toEqual(2);
    expect(res.body[0].id).toEqual(user2Response1.body.id);
    expect(res.body[1].id).toEqual(user2Response2.body.id);
    expect(orders.length).toEqual(3);
  });
});
