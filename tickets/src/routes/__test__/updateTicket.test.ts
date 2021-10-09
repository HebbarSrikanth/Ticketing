import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

describe('Test cases for updating the ticket', () => {
  it('Check if the ticket id exists, if not send 404 error', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
      .put(`/api/tickets/${id}`)
      .set('Cookie', global.signin())
      .send({
        title: 'asdsa',
        price: 100,
      })
      .expect(404);
  });
  it('Check if the user is authorized to update a ticket', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app).put(`/api/tickets/${id}`).send().expect(401);
  });
  it('Check if user owns the ticket he is about to update,if not send 401 unauthorized error', async () => {
    const saveTicket = await request(app).post(`/api/tickets`).set('Cookie', global.signin()).send({
      title: 'Ticket - 1',
      price: 100,
    });

    await request(app)
      .put(`/api/tickets/${saveTicket.body.id}`)
      .set('Cookie', global.signin())
      .send({
        title: 'sdsdsd',
        price: 100,
      })
      .expect(401);
  });
  it('Check if the price and title are present', async () => {
    const saveTicket = await request(app).post(`/api/tickets`).set('Cookie', global.signin()).send({
      title: 'Ticket - 1',
      price: 100,
    });
    await request(app)
      .put(`/api/tickets/${saveTicket.body.id}`)
      .send({
        title: '',
      })
      .set('Cookie', global.signin())
      .expect(400);

    await request(app)
      .put(`/api/tickets/${saveTicket.body.id}`)
      .set('Cookie', global.signin())
      .send({
        price: '',
      })
      .expect(400);
  });
  it('Check if the post is updated', async () => {
    const cookie = global.signin();

    const saveTicket = await request(app).post(`/api/tickets`).set('Cookie', cookie).send({
      title: 'Ticket - 1',
      price: 100,
    });

    const ticketId = saveTicket.body.id;

    const toUpdateTicketTitle = 'Ticket - 1 updated';
    const updatedResponse = await request(app)
      .put(`/api/tickets/${ticketId}`)
      .send({
        title: toUpdateTicketTitle,
        price: 120,
      })
      .set('Cookie', cookie);

    expect(updatedResponse.status).toEqual(201);
    expect(updatedResponse.body.title).toEqual(toUpdateTicketTitle);
    expect(updatedResponse.body.price).toEqual('120');
  });
});
