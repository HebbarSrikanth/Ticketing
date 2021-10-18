import { OrderTypes } from '@hebbar_ticketing/common';
import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface OrderAttr {
  id: string;
  status: OrderTypes;
  version: number;
  userId: string;
  price: number;
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderTypes;
  version: number;
  price: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attr: OrderAttr): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderTypes),
    },
    userId: {
      type: String,
      required: true,
    },
    price: {
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
orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (orderAttr: OrderAttr) => {
  return new Order({
    _id: orderAttr.id,
    status: orderAttr.status,
    version: orderAttr.version,
    userId: orderAttr.userId,
    price: orderAttr.price,
  });
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
