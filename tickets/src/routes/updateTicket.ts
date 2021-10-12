import express, { Response, Request } from 'express';
import {
  requestAuth,
  NotFoundError,
  NotAuthenticatedError,
  userRequestValidation,
} from '@hebbar_ticketing/common';
import { Ticket } from '../models/tickets';
import { body } from 'express-validator';
import 'express-async-errors';
import { TicketUpdatedPublish } from '../events/publisher/ticket-updated-publish';
import { natsWrapper } from '../natsWrapper';

const router = express.Router();

router.put(
  '/api/tickets/:id',
  requestAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required to update a ticket'),
    body('price').isFloat({ gt: 0 }).withMessage('Provide proper price'),
  ],
  userRequestValidation,
  async (req: Request, res: Response) => {
    console.log(`${req.method} - ${req.url}`);
    const ticketId = req.params.id;
    const ticket = await Ticket.findById({ _id: ticketId });

    //If the ticket is found for that particular id
    if (!ticket) {
      throw new NotFoundError(`Ticket with the id ${ticketId} not found to update`);
    }

    //If ticket is found but the owner of the ticket is different
    if (ticket.userId !== req.currentUser.id) {
      throw new NotAuthenticatedError();
    }

    //Then save the new value
    const { title, price } = req.body;
    ticket.set({
      title,
      price,
    });
    await ticket.save();

    const ticketUpdatePublish = new TicketUpdatedPublish(natsWrapper.client);
    await ticketUpdatePublish.publish({
      id: ticket.id,
      price: Number(ticket.price),
      title: ticket.title,
      userId: ticket.userId,
    });

    res.status(201).send(ticket);
  }
);

export { router as updateTicketRouter };
