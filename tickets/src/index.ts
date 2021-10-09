import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  try {
    //If mongo url is not provided through env in the cluster
    if (!process.env.MONGO_URI) {
      throw new Error('Mongo URI not found');
    }
    //Check also for the JWT key
    if (!process.env.JWT_KEY) {
      throw new Error('JSON web token public key was not provided');
    }
    await mongoose.connect(`${process.env.MONGO_URI}`);
    console.log('Connected to ticketing DB!! successfully');
  } catch (error) {
    console.log(error);
  }
  app.listen(3000, () => {
    console.log('Ticketing service is running in the port 3000');
  });
};

start();
