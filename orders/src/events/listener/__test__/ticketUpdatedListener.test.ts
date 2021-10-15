import { Ticket } from '../../../models/tickets';
import { NatsWapper } from '../../../NatsWrapper';
import { TicketUpdateListener } from '../ticketUpdatedListener';
import mongoose from 'mongoose';
import { TicketCreatedEvent } from '@hebbar_ticketing/common';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  //create a baseListener
  const baseListener = new TicketUpdateListener(NatsWapper.client);

  //Save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 120,
    title: 'Ticket- 1',
  });
  await ticket.save();

  //Generate the new update ticket data
  const newIncomingTicketData: TicketCreatedEvent['data'] = {
    id: ticket.id,
    price: 100,
    title: 'Ticket-1 Edited',
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: ticket.version + 1,
  };

  //Mock msg to acknowledge
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { baseListener, ticket, newIncomingTicketData, msg };
};

it('Updates the ticket with the new incoming data', async () => {
  const { baseListener, msg, newIncomingTicketData, ticket } = await setup();

  await baseListener.onMessage(newIncomingTicketData, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket?.title).toEqual(newIncomingTicketData.title);
  expect(updatedTicket?.price).toEqual(newIncomingTicketData.price);
});

it('Acknowledges the data after the update', async () => {
  const { baseListener, msg, newIncomingTicketData, ticket } = await setup();

  await baseListener.onMessage(newIncomingTicketData, msg);

  const updatedTicket = await Ticket.findById(ticket.id);
  expect(msg.ack).toBeCalled();
});

it('Throw an error if the version is different', async () => {
  const { baseListener, msg, newIncomingTicketData, ticket } = await setup();

  newIncomingTicketData.version = 10;

  try {
    await baseListener.onMessage(newIncomingTicketData, msg);
  } catch (err) {}

  expect(msg.ack).not.toBeCalled();
});
