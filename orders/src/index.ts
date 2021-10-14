import mongoose from 'mongoose';
import { app } from './app';
import 'express-async-errors';
import { NatsWapper } from './NatsWrapper';

const start = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('Mongo uri must be provided');
    }
    if (!process.env.NATS_CLIENT_ID) {
      throw new Error('Nats client id must be provided');
    }
    if (!process.env.NATS_CLUSTER_ID) {
      throw new Error('Cluster id must be provided');
    }
    if (!process.env.NATS_URL) {
      throw new Error('Nats url must be provided');
    }
    if (!process.env.MONGO_URI) {
      throw new Error('Mongo uri must be provided');
    }

    await NatsWapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.log(error);
  }
  app.listen(3000, () => {
    console.log('Order service is listening in the port 3000');
  });
};

start();
