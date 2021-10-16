import { ExpirationCompletedEvent, OrderTypes } from '@hebbar_ticketing/common';
import { Ticket } from '../../../models/tickets';
import { Order } from '../../../models/orders';
import { NatsWapper } from '../../../NatsWrapper';
import { ExpirationCompletedListener } from '../expirationCompletedListener';
import mongoose from 'mongoose';

const setup = async () => {
  //Make a base listener
  const baseListener = new ExpirationCompletedListener(NatsWapper.client);

  //Save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 120,
    title: 'Ticket- 1',
  });
  await ticket.save();

  //Create an order
  const order = Order.build({
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: new Date(),
    ticket,
    status: OrderTypes.Created,
  });
  await order.save();

  //Mock a data that is coming from the ticket service
  const data: ExpirationCompletedEvent['data'] = {
    orderId: order.id,
  };

  //Mock a msg to acknowledge
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { baseListener, data, msg, order, ticket };
};

it('Cancels the order after the expiration', async () => {
  const { data, msg, baseListener, order } = await setup();

  await baseListener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder?.status).toEqual(OrderTypes.Cancelled);
});

it('Calls out the order:cancelled event', async () => {
  const { data, msg, baseListener, order } = await setup();

  await baseListener.onMessage(data, msg);

  console.log((NatsWapper.client.publish as jest.Mock).mock.calls[1][1]);
  const value = JSON.parse((NatsWapper.client.publish as jest.Mock).mock.calls[1][1]);
  expect(value.id).toEqual(order.id);
});

it('Acknowledges', async () => {
  const { data, msg, baseListener, order } = await setup();

  await baseListener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalledTimes(1);
});
