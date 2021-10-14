import { NotAuthenticatedError, NotFoundError, requestAuth } from '@hebbar_ticketing/common';
import express, { Request, Response } from 'express';
import { Order, OrderTypes } from '../models/orders';
import 'express-async-errors';

const router = express.Router();

router.delete('/api/orders/:id', requestAuth, async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new NotFoundError('Order not found');
  }

  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthenticatedError();
  }

  order.status = OrderTypes.Cancelled;
  await order.save();

  return res.status(204).send(order);
});

export { router as deleteIndividualOrderRouter };
