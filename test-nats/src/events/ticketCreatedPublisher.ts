import BasePublisher from './base-publisher';
import Subject from './subject';
import TicketCreatedEvent from './ticketCreatedEvent';

export default class TicketCreatedPublisher extends BasePublisher<TicketCreatedEvent> {
  subject: Subject.TicketCreated = Subject.TicketCreated;
}
