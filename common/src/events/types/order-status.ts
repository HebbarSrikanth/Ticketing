export enum OrderTypes {
  //When the order has been created, but the ticket it is trying to order has not been reserved
  Created = 'created',
  //When the order is trying to reserve has already been reserved,or when the user has cancelled the order
  //When the time allocated for payment has been expired
  Cancelled = 'cancelled',
  //When user has order but waiting for paymenr
  AwaitingPayment = 'payment:awaiting',
  //When the order has reserved the ticket and the user has provided payment successfully
  Complete = 'complete',
}
