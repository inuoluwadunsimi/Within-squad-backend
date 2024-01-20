import * as mongoose from "mongoose";
import { Schema } from "mongoose";
import { config } from "../constants/settings";
import { v4 as uuidv4 } from "uuid";
import { Payment } from "../interfaces";

const paymentSchema = new Schema<Payment>(
  {
    _id: {
      type: String,
      default: function genUUID() {
        return uuidv4();
      },
    },
    name: { type: String, required: true },
    description: {
      type: String,
      required: false,
    },
    amount: {
      type: Number,
      required: true,
    },
    dueDate: {
      type: Date,
    },
    space: {
      type: String,
      required: true,
      ref: config.mongodb.collections.space,
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

export const PaymentDb = mongoose.model(
  config.mongodb.collections.payment,
  paymentSchema
);
