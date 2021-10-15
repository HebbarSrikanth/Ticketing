import { BaseListener, OrderCancelledEvent, Subject } from '@hebbar_ticketing/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/tickets';
import { TicketUpdatedPublish } from '../publisher/ticket-updated-publish';
import { queueGroupName } from './queueGroupName';

export class OrderCancelledListener extends BaseListener<OrderCancelledEvent> {
  subject: Subject.OrderCancelled = Subject.OrderCancelled;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error('Ticket not found!');
    }

    ticket.set({ orderId: undefined });
    await ticket.save({});

    const ticketUpdatedListener = new TicketUpdatedPublish(this.client);
    ticketUpdatedListener.publish({
      id: ticket.id,
      price: Number(ticket.price),
      title: ticket.id,
      userId: ticket.userId,
      version: ticket.version,
      orderId: ticket.orderId,
    });

    msg.ack();
  }
}
