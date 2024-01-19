import * as mongoose from "mongoose";
import { Schema } from "mongoose";
import { config } from "../constants/settings";
import { v4 as uuidv4 } from "uuid";
import { PaymentStatus } from "../interfaces/payment/payment.request";

const PaymentAttemtSchema = new Schema(
  {
    _id: {
      type: String,
      default: function genUUID() {
        return uuidv4();
      },
    },
    payment: {
      type: String,
      required: true,
      ref: config.mongodb.collections.payment,
    },
    user: {
      type: String,
      required: true,
      ref: config.mongodb.collections.user,
    },
    status: {
      type: String,
      required: true,
      enums: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    transaction_reference: {
      type: String,
      required: true,
    },
  },
  {
    toObject: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
    timestamps: true,
    versionKey: false,
  }
);

export const PaymentAttemptDb = mongoose.model(
  config.mongodb.collections.paymentAttempt,
  PaymentAttemtSchema
);
