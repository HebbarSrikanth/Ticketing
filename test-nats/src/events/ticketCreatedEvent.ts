import Subject from './subject';

export default interface TicketCreatedEvent {
  subject: Subject.TicketCreated;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
  };
}
