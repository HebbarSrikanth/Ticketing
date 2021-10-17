import { Subject } from '..';

export interface PaymentCompleteEvent {
  subject: Subject.PaymentCompleted;
  data: {
    id: string;
    stripeId: string;
    orderId: string;
  };
}
