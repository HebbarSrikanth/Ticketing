import {
  BadRequest,
  NotAuthenticatedError,
  NotFoundError,
  OrderTypes,
  userRequestValidation,
  requestAuth,
} from '@hebbar_ticketing/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Order } from '../models/order';
import 'express-async-errors';
import { stripe } from '../Stripe';
import { PaymentCompletedPublisher } from '../events/publisher/paymentCompletedPublisher';
import { natsWrapper } from '../NatsWrapper';
import { Payment } from '../models/payment';

const router = express.Router();

router.post(
  '/api/payments',
  requestAuth,
  [
    body('orderId').not().isEmpty().withMessage('OrderId is required'),
    body('token').not().isEmpty().withMessage('Token is required'),
  ],
  userRequestValidation,
  async (req: Request, res: Response) => {
    console.log(`${req.method} - ${req.url}`);

    const { token, orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!orderId) {
      throw new NotFoundError(`Order with ${orderId} not found`);
    }

    if (order?.userId !== req.currentUser.id) {
      throw new NotAuthenticatedError();
    }

    if (order.status === OrderTypes.Cancelled) {
      throw new BadRequest('Status is cancelled');
    }

    const charge = await stripe.charges.create({
      currency: 'inr',
      source: token,
      amount: order.price * 100,
    });

    console.log('Payment completed');

    const payment = Payment.build({
      orderId: order.id,
      stripeId: charge.id,
    });

    await payment.save();

    new PaymentCompletedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).send({ id: payment.id });
  }
);

export { router as newPaymentRouter };
