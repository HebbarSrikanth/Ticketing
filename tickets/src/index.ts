import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './natsWrapper';

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
    if (!process.env.NATS_CLUSTER_ID) {
      throw new Error('Nats cluster id was not provided');
    }
    if (!process.env.NATS_CLIENT_ID) {
      throw new Error('Nats URL was not provided');
    }
    if (!process.env.NATS_URL) {
      throw new Error('Nats client id was not provided');
    }
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    await mongoose.connect(`${process.env.MONGO_URI}`);
    console.log('Connected to ticketing DB!! successfully');

    natsWrapper.client.on('close', () => {
      console.log('NATS Straming is about to close');
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    //process.on('SIGKILL', () => natsWrapper.client.close());
  } catch (error) {
    console.log(error);
  }
  app.listen(3000, () => {
    console.log('Ticketing service is running in the port 3000');
  });
};

start();
