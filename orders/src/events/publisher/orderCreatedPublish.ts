import { BasePublisher, OrderCreatedEvent, Subject } from '@hebbar_ticketing/common';

export class OrderCreatedPublish extends BasePublisher<OrderCreatedEvent> {
  subject: Subject.OrderCreated = Subject.OrderCreated;
}
