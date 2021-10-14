import express from 'express';
import { errorHandler, NotFoundError, currentUser } from '@hebbar_ticketing/common';
import { newOrderRouter } from './src/routes/newOrder';
import 'express-async-errors';
import cookie from 'cookie-session';
import { fetchIndividualOrderRouter } from './src/routes/fetchIndividualOrderDetails';
import { fetchOrderOfIndividualUserRouter } from './src/routes/fetchOrdersforIndividualUser';
import { deleteIndividualOrderRouter } from './src/routes/deleteIndividualOrder';

const app = express();
app.use(express.json());
//To extract the current user details
app.set('trust proxy', 1);
app.use(
  cookie({
    signed: false,
    secure: true,
  })
);

app.use(currentUser);

app.use(newOrderRouter);
app.use(fetchOrderOfIndividualUserRouter);
app.use(fetchIndividualOrderRouter);
app.use(deleteIndividualOrderRouter);

//If the url is not valid
app.all('*', (req, res) => {
  throw new NotFoundError(`${req.url} - url was not found`);
});

app.use(errorHandler);

export { app };
