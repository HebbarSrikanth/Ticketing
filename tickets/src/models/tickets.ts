import mongoose from 'mongoose';

interface TicketAttr {
  title: string;
  price: string;
  userId: string;
}

interface TicketDoc extends mongoose.Document {
  title: string;
  price: string;
  userId: string;
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
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform: (doc, resDoc) => {
        resDoc.id = resDoc._id;
        delete resDoc._id;
      },
      versionKey: false,
    },
  }
);

ticketSchema.statics.build = (attr: TicketAttr) => {
  return new Ticket(attr);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Tickets', ticketSchema);

export { Ticket };
