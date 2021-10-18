import { OrderCreatedEvent, OrderTypes } from '@hebbar_ticketing/common';
import { natsWrapper } from '../../../NatsWrapper';
import { OrderCreatedListener } from '../orderCreatedListener';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Order } from '../../../models/order';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  //Incoming data
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: new Date().toISOString(),
    status: OrderTypes.Created,
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
      price: '120',
    },
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 1,
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('Saves the order', async () => {
  const { data, listener, msg } = await setup();

  await listener.onMessage(data, msg);

  const newOrder = await Order.findById(data.id);

  expect(newOrder?.id).toEqual(data.id);
  expect(newOrder?.price).toEqual(data.ticket.price);
});

it('Acknowledges the messgae', async () => {
  const { data, listener, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toBeCalled();
});
