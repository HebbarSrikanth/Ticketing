import { OrderCancelledEvent, OrderTypes } from '@hebbar_ticketing/common';
import { natsWrapper } from '../../../NatsWrapper';
import mongoose from 'mongoose';
import { Order } from '../../../models/order';
import { OrderCancelledListener } from '../orderCancelledListener';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 120,
    status: OrderTypes.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
  });
  await order.save();

  //Incoming data
  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
    },
    version: 1,
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('Canceles the order', async () => {
  const { data, listener, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(data.id);
  expect(updatedOrder?.status).toEqual(OrderTypes.Cancelled);
});

it('Acknowledges the message', async () => {
  const { data, listener, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toBeCalled();
});
