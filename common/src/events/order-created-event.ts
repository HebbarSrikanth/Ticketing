import { OrderTypes, Subject } from '..';

export interface OrderCreatedEvent {
  subject: Subject.OrderCreated;
  data: {
    userId: string;
    status: OrderTypes;
    expiresAt: string;
    id: string;
    ticket: {
      id: string;
      price: string;
    };
  };
}
