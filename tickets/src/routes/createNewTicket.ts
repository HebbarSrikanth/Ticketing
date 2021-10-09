import express, { Request, Response } from 'express';
import { requestAuth, userRequestValidation } from '@hebbar_ticketing/common';
import { body } from 'express-validator';
import { Ticket } from '../models/tickets';
import 'express-async-errors';

const router = express.Router();

router.post(
  '/api/tickets',
  requestAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required!'),
    body('price').isFloat({ gt: 0 }).withMessage('Price is not valid/Empty'),
  ],
  userRequestValidation,
  async (req: Request, res: Response) => {
    console.log(`${req.method} - ${req.url}`);

    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser.id,
    });

    await ticket.save();

    res.status(201).send(ticket);
  }
);

export { router as createNewTicketRouter };
