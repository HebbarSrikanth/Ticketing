import { BasePublisher, ExpirationCompletedEvent, Subject } from '@hebbar_ticketing/common';

export class ExpirationCompletedPublisher extends BasePublisher<ExpirationCompletedEvent> {
  subject: Subject.ExpirationCompleted = Subject.ExpirationCompleted;
}
