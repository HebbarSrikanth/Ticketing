import express from 'express';
import { Ticket } from '../models/tickets';

const router = express.Router();

router.get('/api/tickets', async (req, res) => {
  console.log(`${req.method} - ${req.url}`);
  const tickets = await Ticket.find({
    orderId: undefined,
  });

  res.status(200).send(tickets);
});

export { router as fetchAllTicketRouter };
