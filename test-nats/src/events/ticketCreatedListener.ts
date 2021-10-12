import { Message } from 'node-nats-streaming';
import BaseListener from './base-listener';
import Subject from './subject';
import TicketCreatedEvent from './ticketCreatedEvent';

class TicketCreatedListener extends BaseListener<TicketCreatedEvent> {
  subject: Subject.TicketCreated = Subject.TicketCreated;
  queueGroupName = 'ticketing-service';

  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log(`Event data - ${data} - ${msg.getSequence()} - ${msg.getData()}`);
    //Business logic
    msg.ack();
  }
}

export default TicketCreatedListener;
