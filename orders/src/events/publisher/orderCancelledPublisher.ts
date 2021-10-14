import { BasePublisher, OrderCancelledEvent, Subject } from '@hebbar_ticketing/common';

export class OrderCancelledPublisher extends BasePublisher<OrderCancelledEvent> {
  subject: Subject.OrderCancelled = Subject.OrderCancelled;
}
