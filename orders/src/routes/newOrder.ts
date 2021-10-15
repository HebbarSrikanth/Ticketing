import express, { Request, Response } from 'express';
import 'express-async-errors';
import {
  BadRequest,
  NotFoundError,
  OrderTypes,
  requestAuth,
  userRequestValidation,
} from '@hebbar_ticketing/common';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Ticket } from '../models/tickets';
import { Order } from '../models/orders';
import { OrderCreatedPublish } from '../events/publisher/orderCreatedPublish';
import { NatsWapper } from '../NatsWrapper';

const router = express.Router();

router.post(
  '/api/orders',
  requestAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Ticket Id must be provided'),
  ],
  userRequestValidation,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    const EXPIRES_TIME = 15 * 60;

    //Check if the ticket exists
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError('Ticket not found');
    }

    //Check if the ticket is reserved
    const existingOrder = await ticket.isReserved();

    if (existingOrder) {
      throw new BadRequest('Ticket has been reserved');
    }

    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + EXPIRES_TIME);

    const newOrder = Order.build({
      status: OrderTypes.Created,
      userId: req.currentUser!.id,
      expiresAt: new Date(),
      ticket,
    });
    await newOrder.save();

    //Publish the event to the NATS Streaming messaging server
    const orderCreatedPublish = new OrderCreatedPublish(NatsWapper.client);
    orderCreatedPublish.publish({
      id: newOrder.id,
      status: newOrder.status,
      userId: newOrder.userId,
      expiresAt: newOrder.expiresAt.toISOString(),
      version: newOrder.version,
      ticket: {
        id: newOrder.ticket.id,
        price: newOrder.ticket.price.toString(),
      },
    });

    res.status(201).send(newOrder);
  }
);

export { router as newOrderRouter };
