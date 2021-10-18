import mongoose from 'mongoose';
import { app } from './app';
import { OrderCancelledListener } from './events/listener/orderCancelledListener';
import { OrderCreatedListener } from './events/listener/orderCreatedListener';
import { natsWrapper } from './NatsWrapper';

const start = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('Monog uri must be provided');
    }
    if (!process.env.NATS_URL) {
      throw new Error('Nats uri must be provided');
    }
    if (!process.env.NATS_CLIENT_ID) {
      throw new Error('Nats client id must be provided');
    }
    if (!process.env.NATS_CLUSTER_ID) {
      throw new Error('nats cluster id must be provided');
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Payment service connected to mongo DB!!!');

    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();
  } catch (error) {
    console.log('Some error!!', error);
  }
  app.listen(3000, () => {
    console.log('Payments service is listening in the port 3000');
  });
};

start();
