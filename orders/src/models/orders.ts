import mongoose from 'mongoose';
import { OrderTypes } from '@hebbar_ticketing/common';
import { TicketDoc } from './tickets';

export { OrderTypes };

interface OrderAttr {
  userId: string;
  status: OrderTypes;
  expiresAt: Date;
  ticket: TicketDoc;
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderTypes;
  expiresAt: Date;
  ticket: TicketDoc;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attr: OrderAttr): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: OrderTypes.Created,
      enum: Object.values(OrderTypes),
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Types.ObjectId,
      ref: 'Ticket',
    },
  },
  {
    toJSON: {
      transform(doc, res) {
        (res.id = res._id), delete res._id;
      },
    },
  }
);

orderSchema.statics.build = (attr: OrderAttr) => {
  return new Order(attr);
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
