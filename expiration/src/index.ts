import { OrderCreatedListener } from './events/listener/orderCreatedListener';
import { natsWrapper } from './NatsWrapper';

const start = async () => {
  try {
    if (!process.env.NATS_URL) {
      throw new Error('Nats URL must be provided');
    }
    if (!process.env.NATS_CLUSTER_ID) {
      throw new Error('Nats cluster id must be provided');
    }
    if (!process.env.NATS_CLIENT_ID) {
      throw new Error('Nats client id must be provided');
    }

    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    const orderCreatedListener = new OrderCreatedListener(natsWrapper.client);
    orderCreatedListener.listen();
  } catch (error) {
    console.log(error);
  }
};

start();
