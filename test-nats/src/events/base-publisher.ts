import { Stan } from 'node-nats-streaming';
import Subject from './subject';

interface TicketPublishEvent {
  subject: Subject.TicketCreated;
  data: any;
}

abstract class BasePublisher<T extends TicketPublishEvent> {
  abstract subject: T['subject'];
  private client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  publish = (data: T['data']): Promise<void> =>
    new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) {
          console.log(err);
          reject(err);
        }

        console.log('Published into NAT server');
        resolve();
      });
    });
}

export default BasePublisher;
