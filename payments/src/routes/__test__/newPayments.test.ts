import { app } from '../../app';
import request from 'supertest';
import { Order } from '../../models/order';
import mongoose from 'mongoose';
import { OrderTypes } from '@hebbar_ticketing/common';
import { stripe } from '../../Stripe';
import { Payment } from '../../models/payment';

describe('Test cases for the New Payment API service', () => {
  it('Not Authorized 401 if the user is not signed in', async () => {
    await request(app).post('/api/payments').send({}).expect(401);
  });

  it('Bad request 400 if the proper data is not provided in the user body', async () => {
    await request(app).post('/api/payments').set('Cookie', global.signin()).send().expect(400);

    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signin())
      .send({
        token: '',
      })
      .expect(400);

    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signin())
      .send({
        orderId: '',
      })
      .expect(400);

    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signin())
      .send({
        token: '',
        orderId: '',
      })
      .expect(400);
  });

  it('401 error if other user tries to access the ticket', async () => {
    const order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      price: 120,
      status: OrderTypes.Created,
      userId: new mongoose.Types.ObjectId().toHexString(),
      version: 1,
    });
    await order.save();

    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signin())
      .send({
        token: '123456',
        orderId: order.id,
      })
      .expect(401);
  });

  it('400 error if the user is trying to access the order that has been cancelled', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      price: 120,
      status: OrderTypes.Cancelled,
      userId,
      version: 1,
    });
    await order.save();

    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signin(userId))
      .send({
        token: '123456',
        orderId: order.id,
      })
      .expect(400);
  });

  it('Success if all well', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const price = Math.floor(Math.random() * 1000000);
    const order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      price,
      status: OrderTypes.Created,
      userId,
      version: 1,
    });
    await order.save();

    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signin(userId))
      .send({
        token: 'tok_visa',
        orderId: order.id,
      })
      .expect(201);

    const customers = await stripe.charges.list({
      limit: 50,
    });

    const stripeCharge = customers.data.find((customer) => customer.amount === price * 100);
    expect(stripeCharge).toBeDefined();

    const payment = await Payment.findOne({
      stripeId: stripeCharge?.id,
      orderId: order.id,
    });

    expect(payment).not.toBeNull();
  });
});
