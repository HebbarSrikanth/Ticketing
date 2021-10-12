import { Subject, TicketUpdatedEvent, BasePublisher } from '@hebbar_ticketing/common';

export class TicketUpdatedPublish extends BasePublisher<TicketUpdatedEvent> {
  subject: Subject.TicketUpdated = Subject.TicketUpdated;
}
