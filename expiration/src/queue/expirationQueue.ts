import Queue from 'bull';
import { natsWrapper } from '../NatsWrapper';
import { ExpirationCompletedPublisher } from '../events/publisher/expirationCompletedPublisher';

interface Payload {
  orderId: string;
}

const queue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

queue.process((msg) => {
  console.log('We have to emit an event saying that expiration:complete', msg.data.orderId);

  const expirationCompletedPublisher = new ExpirationCompletedPublisher(natsWrapper.client);
  expirationCompletedPublisher.publish({
    orderId: msg.data.orderId,
  });
});

export { queue };
