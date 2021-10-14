import mongoose from 'mongoose';
import { OrderTypes, Order } from './orders';

interface TicketAttr {
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attr: TicketAttr): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
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

ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [OrderTypes.Created, OrderTypes.AwaitingPayment, OrderTypes.Complete],
    },
  });
  return !!existingOrder;
};

ticketSchema.statics.build = (attr: TicketAttr) => {
  return new Ticket(attr);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
