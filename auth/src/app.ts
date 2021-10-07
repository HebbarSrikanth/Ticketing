// Import all the required dependenices
import express from 'express';
import { currentUser } from './routes/current-users';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middleware/error-handler';
import { NotFoundError } from './error/notFoundError';
import 'express-async-errors';

import cookieSession from 'cookie-session';

const app = express();

//Ingress-controller will route the request and that will a proxy hence we have
//to specify to trust the proxy
app.set('trust proxy', 1);
app.use(express.json());

//We also have to add a middleware to create a cookie
//Signed option to make sure that cookie is not encrypted &
//Secure option to make sure that only cookie is stored when it's is a HTTPS connection
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

//Router configurations to handle the routes realted to auth
app.use(currentUser);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

//Catch if the URL is not found
app.all('*', async () => {
  throw new NotFoundError('Invalid URL!!');
});

//Catch in case of any error occurs
app.use(errorHandler);

export { app };
