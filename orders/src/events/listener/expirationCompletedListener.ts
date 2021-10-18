import {
  BaseListener,
  ExpirationCompletedEvent,
  OrderTypes,
  Subject,
} from '@hebbar_ticketing/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/orders';
import { OrderCancelledPublisher } from '../publisher/orderCancelledPublisher';
import { queueGroupName } from './queueGroupName';

export class ExpirationCompletedListener extends BaseListener<ExpirationCompletedEvent> {
  subject: Subject.ExpirationCompleted = Subject.ExpirationCompleted;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompletedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket');

    if (!order) {
      throw new Error('Order details not found');
    }

    if (order.status === OrderTypes.Complete) {
      console.log('Here after the cancellation');
      msg.ack();
      return;
    }

    order.set({ status: OrderTypes.Cancelled });
    await order.save();

    const orderCancelledPublisher = new OrderCancelledPublisher(this.client);
    await orderCancelledPublisher.publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
      version: order.version,
    });

    msg.ack();
  }
}
