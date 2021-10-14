import { Subject } from '..';

export interface OrderCancelledEvent {
  subject: Subject.OrderCancelled;
  data: {
    id: string;
    ticket: {
      id: string;
    };
  };
}
