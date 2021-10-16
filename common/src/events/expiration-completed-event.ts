import { Subject } from '..';

export interface ExpirationCompletedEvent {
  subject: Subject.ExpirationCompleted;
  data: {
    orderId: string;
  };
}
