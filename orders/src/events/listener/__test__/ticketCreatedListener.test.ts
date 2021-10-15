import { TicketCreatedEvent } from '@hebbar_ticketing/common';
import { NatsWapper } from '../../../NatsWrapper';
import { TicketCreatedListener } from '../ticketCreatedListener';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/tickets';

const setup = () => {
  //Make a base listener
  const baseListener = new TicketCreatedListener(NatsWapper.client);

  //Mock a data that is coming from the ticket service
  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 100,
    title: 'Ticket-1',
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 1,
  };

  //Mock a msg to acknowledge
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { baseListener, data, msg };
};

it('listen to the event and create a entry in odrer service tickets db', async () => {
  const { baseListener, data, msg } = setup();

  await baseListener.onMessage(data, msg);

  const ticket = await Ticket.findById(data.id);

  expect(ticket?.title).toEqual(data.title);
  expect(ticket?.price).toEqual(data.price);
});

it('check if the message is acknowledge', async () => {
  const { baseListener, data, msg } = setup();
  await baseListener.onMessage(data, msg);

  expect(msg.ack).toBeCalled();
});
