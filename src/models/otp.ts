import * as mongoose from "mongoose";
import { Schema } from "mongoose";
import { config } from "../constants/settings";
import { v4 as uuidv4 } from "uuid";
import { type Spaces } from "../interfaces";

const OtpSchema = new Schema(
  {
    _id: {
      type: String,
      default: function genUUID() {
        return uuidv4();
      },
    },
    otp: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
      ref: config.mongodb.collections.user,
    },
    space: {
      type: String,
      required: true,
      ref: config.mongodb.collections.otp,
    },
    expiresAt: {
      type: Date,
      default: Date.now(),
      index: { expires: "10m" },
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

export const OtpDb = mongoose.model(config.mongodb.collections.otp, OtpSchema);
