import { BasePublisher, PaymentCompleteEvent, Subject } from '@hebbar_ticketing/common';

export class PaymentCompletedPublisher extends BasePublisher<PaymentCompleteEvent> {
  subject: Subject.PaymentCompleted = Subject.PaymentCompleted;
}
