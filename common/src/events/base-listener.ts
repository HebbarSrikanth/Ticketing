//What is constant across many object write those function here and the other individual implementation is made as abstract
import { Message, Stan } from 'node-nats-streaming';
import { Subject } from './subject';

interface TicketCreateListener {
  subject: Subject;
  data: any;
}

export abstract class BaseListener<T extends TicketCreateListener> {
  protected client: Stan;
  abstract subject: T['subject'];
  abstract queueGroupName: string;
  protected ackWait = 5 * 1000;
  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOption() {
    return this.client
      .subscriptionOptions()
      .setManualAckMode(true)
      .setDeliverAllAvailable()
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  abstract onMessage(data: T['data'], msg: Message): void;

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOption()
    );

    subscription.on('message', (msg: Message) => {
      console.log(`Msg received ${this.subject} / ${this.queueGroupName}`);
      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    if (typeof data === 'string') {
      return JSON.parse(data);
    } else {
      return JSON.parse(data.toString('utf-8'));
    }
  }
}
