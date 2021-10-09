import express from 'express';
import { errorHandler, NotFoundError } from '@hebbar_ticketing/common';
import 'express-async-errors';
import cookie from 'cookie-session';
import { createNewTicketRouter } from './routes/createNewTicket';
import { currentUser } from '@hebbar_ticketing/common';
import { individualTicketDetailRouter } from './routes/fetchIndividualTicket';
import { fetchAllTicketRouter } from './routes/fetchAllTickets';
import { updateTicketRouter } from './routes/updateTicket';

const app = express();
app.use(express.json());
//Since ingress-controller route to ticket from the user request
//Its doing like a proxy for sending out the request hence seting to allow proxy
app.set('trust proxy', 1);
app.use(
  cookie({
    secure: true,
    signed: false,
  })
);
app.use(currentUser);

app.use(individualTicketDetailRouter);
app.use(fetchAllTicketRouter);
app.use(updateTicketRouter);
app.use(createNewTicketRouter);

app.all('*', (req, res) => {
  throw new NotFoundError(req.url);
});

app.use(errorHandler);

export { app };
