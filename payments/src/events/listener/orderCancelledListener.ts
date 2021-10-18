import { BaseListener, OrderCancelledEvent, OrderTypes, Subject } from '@hebbar_ticketing/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from './queueGroupName';

export class OrderCancelledListener extends BaseListener<OrderCancelledEvent> {
  subject: Subject.OrderCancelled = Subject.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const { id, version } = data;
    const order = await Order.findOne({
      _id: id,
      version: version - 1,
    });

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({ status: OrderTypes.Cancelled });
    await order.save();

    msg.ack();
  }
}
