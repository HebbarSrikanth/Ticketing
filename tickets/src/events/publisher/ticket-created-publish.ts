import { BasePublisher, Subject, TicketCreatedEvent } from '@hebbar_ticketing/common';

export class TicketCreatedPublisher extends BasePublisher<TicketCreatedEvent> {
  subject: Subject.TicketCreated = Subject.TicketCreated;
}
