import { listener, Subject, TicketCreatedEvent } from '@hebbar_ticketing/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/tickets';
import { queueGroupName } from './queueGroupName';

export class TicketCreatedListener extends listener<TicketCreatedEvent> {
  subject: Subject.TicketCreated = Subject.TicketCreated;
  queueGroupName = queueGroupName;

  onMessage = async (data: TicketCreatedEvent['data'], msg: Message) => {
    const { id, title, price } = data;

    const ticket = Ticket.build({
      id,
      title,
      price,
    });
    await ticket.save();

    msg.ack();
  };
}
