import * as mongoose from "mongoose";
import { Schema } from "mongoose";
import { config } from "../constants/settings";
import { v4 as uuidv4 } from "uuid";

const WalletSchema = new Schema(
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
    available_balance: {
      type: Number,
      required: true,
      default: 0,
    },
    pending_balance: {
      type: Number,
      default: 0,
    },
    lock_withdrawals: {
      type: Number,
      default: 0,
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

export const WalletDb = mongoose.model(
  config.mongodb.collections.wallet,
  WalletSchema
);
