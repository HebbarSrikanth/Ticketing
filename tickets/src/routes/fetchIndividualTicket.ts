import { NotFoundError } from '@hebbar_ticketing/common';
import express from 'express';
import { Ticket } from '../models/tickets';
import 'express-async-errors';

const router = express.Router();

router.get('/api/tickets/:id', async (req, res) => {
  console.log(`${req.method} - ${req.url}`);
  const id = req.params.id;

  const ticket = await Ticket.findById({ _id: id });

  if (!ticket) {
    throw new NotFoundError(`Ticket was not found for the id - ${id}`);
  }

  res.status(200).send(ticket);
});

export { router as individualTicketDetailRouter };
