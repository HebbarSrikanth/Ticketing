import { Ticket } from '../../../models/tickets';
import { natsWrapper } from '../../../natsWrapper';
import mongoose from 'mongoose';
import { OrderCancelledEvent } from '@hebbar_ticketing/common';
import { Message } from 'node-nats-streaming';
import { OrderCancelledListener } from '../orderCancelledListener';

const setup = async () => {
  //Create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);

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

  const incomingOrderData: OrderCancelledEvent['data'] = {
    id: orderId,
    ticket: {
      id: ticket.id,
    },
    version: 1,
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { ticket, incomingOrderData, listener, msg };
};

it('Cancelled the event', async () => {
  const { ticket, listener, msg, incomingOrderData } = await setup();

  await listener.onMessage(incomingOrderData, msg);

  const updatedEvent = await Ticket.findById(ticket.id);

  expect(updatedEvent?.orderId).not.toBeDefined();
});

it('Acknowledge the message after the update of the event', async () => {
  const { ticket, listener, msg, incomingOrderData } = await setup();

  await listener.onMessage(incomingOrderData, msg);

  expect(msg.ack).toBeCalled();
});
