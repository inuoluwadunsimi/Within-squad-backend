import * as mongoose from "mongoose";
import { Schema } from "mongoose";
import { config } from "../constants/settings";
import { v4 as uuidv4 } from "uuid";
import { type Announcement } from "../interfaces";

const AnnouncementSchema = new Schema<Announcement>(
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

    description: {
      type: String,
      required: true,
    },
    title: {
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
    //
  }
);

export const AnnouncementDb = mongoose.model(
  config.mongodb.collections.announcement,
  AnnouncementSchema
);
