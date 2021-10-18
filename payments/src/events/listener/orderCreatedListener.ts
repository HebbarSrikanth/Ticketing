import { BaseListener, OrderCreatedEvent, Subject } from '@hebbar_ticketing/common';
import { queueGroupName } from './queueGroupName';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';

export class OrderCreatedListener extends BaseListener<OrderCreatedEvent> {
  subject: Subject.OrderCreated = Subject.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const { id, version, status, userId, ticket } = data;

    const order = Order.build({
      id,
      version,
      status,
      userId,
      price: Number(ticket.price),
    });
    await order.save();

    msg.ack();
  }
}
