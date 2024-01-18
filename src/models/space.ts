import * as mongoose from "mongoose";
import { Schema } from "mongoose";
import { config } from "../constants/settings";
import { v4 as uuidv4 } from "uuid";
import { type Spaces } from "../interfaces";

const SpacesSchema = new Schema<Spaces>(
  {
    _id: {
      type: String,
      default: function genUUID() {
        return uuidv4();
      },
    },
    name: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    spaceCode: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
      required: true,
      ref: config.mongodb.collections.user,
    },
    members: [{ type: String, ref: config.mongodb.collections.user }],
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

export const SpaceDb = mongoose.model(
  config.mongodb.collections.space,
  SpacesSchema
);
