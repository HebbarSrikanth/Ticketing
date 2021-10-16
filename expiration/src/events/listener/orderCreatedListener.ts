import { BaseListener, OrderCreatedEvent, Subject } from '@hebbar_ticketing/common';
import { Message } from 'node-nats-streaming';
import { queue } from '../../queue/expirationQueue';
import { queueGroupName } from './queueGroupName';

export class OrderCreatedListener extends BaseListener<OrderCreatedEvent> {
  subject: Subject.OrderCreated = Subject.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const expiry = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log(expiry);
    await queue.add(
      {
        orderId: data.id,
      },
      //Other options like delay and other things
      {
        delay: expiry,
      }
    );

    msg.ack();
  }
}
