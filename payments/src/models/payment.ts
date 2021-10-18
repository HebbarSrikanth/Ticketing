import mongoose from 'mongoose';

interface PaymentAttr {
  orderId: string;
  stripeId: string;
}

interface PaymentDoc extends mongoose.Document {
  orderId: string;
  stripeId: string;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attr: PaymentAttr): PaymentDoc;
}

const paymentSchema = new mongoose.Schema(
  {
    stripeId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
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

paymentSchema.statics.build = (attr: PaymentAttr) => {
  return new Payment(attr);
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>('Payment', paymentSchema);

export { Payment };
