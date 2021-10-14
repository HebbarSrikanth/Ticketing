import { requestAuth } from '@hebbar_ticketing/common';
import express, { Request, Response } from 'express';
import 'express-async-errors';
import { Order } from '../models/orders';

const router = express.Router();

router.get('/api/orders', requestAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate('ticket');

  res.status(200).send(orders);
});

export { router as fetchOrderOfIndividualUserRouter };
