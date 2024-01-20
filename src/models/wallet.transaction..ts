import * as mongoose from "mongoose";
import { Schema } from "mongoose";
import { config } from "../constants/settings";
import { v4 as uuidv4 } from "uuid";
import { PaymentStatus } from "../interfaces/payment/payment.request";

export enum ClerkType {
  DEBIT = "DEBIT",
  CREDIT = "CREDIT",
}

const WalletTransactionSchema = new Schema(
  {
    _id: {
      type: String,
      default: function genUUID() {
        return uuidv4();
      },
    },
    space: {
      type: String,
      required: true,
      ref: config.mongodb.collections.space,
    },
    payment: {
      type: String,
      required: true,
      ref: config.mongodb.collections.payment,
    },
    wallet: {
      type: String,
      required: true,
      ref: config.mongodb.collections.wallet,
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    clerkType: {
      type: String,
      enum: Object.values(ClerkType),
    },
    amount: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
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
    //
  }
);

export const WalletTransactionDb = mongoose.model(
  config.mongodb.collections.walletTransactions,
  WalletTransactionSchema
);
