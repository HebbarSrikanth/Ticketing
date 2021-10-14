import { NotFoundError, requestAuth, NotAuthenticatedError } from '@hebbar_ticketing/common';
import express, { Request, Response } from 'express';
import { Order } from '../models/orders';
import 'express-async-errors';

const router = express.Router();

router.get('/api/orders/:id', requestAuth, async (req: Request, res: Response) => {
  const orderId = req.params.id;

  let order = await Order.findById(orderId).populate('ticket');

  if (!order) {
    throw new NotFoundError('Order not found');
  }

  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthenticatedError();
  }

  res.status(200).send(order);
});

export { router as fetchIndividualOrderRouter };
