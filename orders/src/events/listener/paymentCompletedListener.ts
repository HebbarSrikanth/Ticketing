import { BaseListener, OrderTypes, PaymentCompleteEvent, Subject } from '@hebbar_ticketing/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/orders';
import { queueGroupName } from './queueGroupName';

export class PaymentCompletedListener extends BaseListener<PaymentCompleteEvent> {
  subject: Subject.PaymentCompleted = Subject.PaymentCompleted;
  queueGroupName = queueGroupName;
  async onMessage(data: PaymentCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error('Order not found!');
    }

    order.set({ status: OrderTypes.Complete });

    await order.save();
    msg.ack();
  }
}
