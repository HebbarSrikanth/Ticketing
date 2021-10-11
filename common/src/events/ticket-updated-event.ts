import Subject from './subject';

export default interface TicketUpdatedEvent {
  subject: Subject.TicketUpdated;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
  };
}
