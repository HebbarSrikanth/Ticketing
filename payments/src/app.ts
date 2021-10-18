import express from 'express';
import cookie from 'cookie-session';
import { NotFoundError, errorHandler, currentUser } from '@hebbar_ticketing/common';
import { newPaymentRouter } from './routes/newPayments';
// import { currentUser } from '../../common/src/middleware/currentUser';
import 'express-async-errors';

const app = express();

app.use(express.json());
app.set('trust proxy', 1);
app.use(
  cookie({
    secure: true,
    signed: false,
  })
);
app.use(currentUser);

app.use(newPaymentRouter);

app.all('*', (req, res) => {
  throw new NotFoundError(`API not found - ${req.url}`);
});

app.use(errorHandler);

export { app };
