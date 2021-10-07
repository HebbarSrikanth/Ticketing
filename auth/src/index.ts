import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  try {
    if (!process.env.JWT_KEY) {
      throw new Error('JWT secret key must be provided');
    }
    await mongoose.connect(`mongodb://auth-db-clu-srv:27017/auth`);
    console.log('Connected to DB!!');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log(`Auth service is listening in the port 3000!`);
  });
};

start();
