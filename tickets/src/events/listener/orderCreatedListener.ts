import { BaseListener, OrderCreatedEvent, Subject } from '@hebbar_ticketing/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/tickets';
import { TicketUpdatedPublish } from '../publisher/ticket-updated-publish';
import { queueGroupName } from './queueGroupName';

export class OrderCreatedListener extends BaseListener<OrderCreatedEvent> {
  subject: Subject.OrderCreated = Subject.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    //Fetch the ticket to which the order id has to be updated with
    const ticket = await Ticket.findById(data.ticket.id);

    //If the ticket is not present then throw out an error
    if (!ticket) {
      throw new Error('Ticket not found!!');
    }

    //Then fetch out the id of the data
    const orderId = data.id;

    //Update the orderID
    ticket.set({ orderId });
    await ticket.save();

    //We have publish out the updated value to others
    const ticketUpdatedPublisher = new TicketUpdatedPublish(this.client);
    ticketUpdatedPublisher.publish({
      id: ticket.id,
      title: ticket.title,
      price: Number(ticket.price),
      userId: ticket.userId,
      version: ticket.version,
      orderId: ticket.orderId,
    });

    msg.ack();
  }
}
