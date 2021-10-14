import { NotAuthenticatedError, NotFoundError, requestAuth } from '@hebbar_ticketing/common';
import express, { Request, Response } from 'express';
import { Order, OrderTypes } from '../models/orders';
import 'express-async-errors';
import { OrderCancelledPublisher } from '../events/publisher/orderCancelledPublisher';
import { NatsWapper } from '../NatsWrapper';

const router = express.Router();

router.delete('/api/orders/:id', requestAuth, async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id).populate('ticket');

  if (!order) {
    throw new NotFoundError('Order not found');
  }

  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthenticatedError();
  }

  order.status = OrderTypes.Cancelled;
  await order.save();

  const orderCancelledPublish = new OrderCancelledPublisher(NatsWapper.client);
  orderCancelledPublish.publish({
    id: order.id,
    ticket: {
      id: order.ticket.id,
    },
  });

  return res.status(204).send(order);
});

export { router as deleteIndividualOrderRouter };
