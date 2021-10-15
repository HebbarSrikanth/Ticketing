import { Ticket } from '../../../models/tickets';
import { natsWrapper } from '../../../natsWrapper';
import { OrderCreatedListener } from '../orderCreatedListener';
import mongoose from 'mongoose';
import { OrderCreatedEvent, OrderTypes } from '@hebbar_ticketing/common';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  //Create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  //Save the ticket
  const ticket = Ticket.build({
    title: 'Ticket - 1',
    price: Number(120).toString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  const orderId = new mongoose.Types.ObjectId().toHexString();
  ticket.set({ orderId });
  await ticket.save();

  const incomingOrderData: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderTypes.Created,
    expiresAt: '123456',
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { ticket, incomingOrderData, listener, msg };
};

it('Order Id is assigned in the ticket service', async () => {
  const { msg, incomingOrderData, ticket, listener } = await setup();

  await listener.onMessage(incomingOrderData, msg);

  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket?.orderId).toEqual(incomingOrderData.id);
  expect(updatedTicket?.orderId).toBeDefined();
});

it('Acknowledge the message after the updation', async () => {
  const { msg, incomingOrderData, ticket, listener } = await setup();

  await listener.onMessage(incomingOrderData, msg);

  expect(msg.ack).toBeCalled();
});
