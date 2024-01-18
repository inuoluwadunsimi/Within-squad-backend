import * as mongoose from "mongoose";
import { Schema } from "mongoose";
import { config } from "../constants/settings";
import { v4 as uuidv4 } from "uuid";
import { type Notification } from "../interfaces";

const NotificationSchema = new Schema<Notification>(
  {
    _id: {
      type: String,
      default: function genUUID() {
        return uuidv4();
      },
    },
    expoToken: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: new Date(),
      required: true,
    },
    user: {
      type: String,
      required: true,
      ref: config.mongodb.collections.user,
    },
    error: {
      type: Boolean,
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
    //
  }
);

export const NotificationDb = mongoose.model(
  config.mongodb.collections.notification,
  NotificationSchema
);
