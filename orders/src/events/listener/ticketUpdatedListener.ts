import { BaseListener, Subject, TicketUpdatedEvent } from '@hebbar_ticketing/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/tickets';
import { queueGroupName } from './queueGroupName';

export class TicketUpdateListener extends BaseListener<TicketUpdatedEvent> {
  subject: Subject.TicketUpdated = Subject.TicketUpdated;
  queueGroupName = queueGroupName;

  onMessage = async (data: TicketUpdatedEvent['data'], msg: Message) => {
    // const ticket = await Ticket.findById(data.id);
    const ticket = await Ticket.findByIdAndVersionNumber(data);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    const { price, title } = data;
    ticket.set({ title, price });
    await ticket.save();
    msg.ack();
  };
}
