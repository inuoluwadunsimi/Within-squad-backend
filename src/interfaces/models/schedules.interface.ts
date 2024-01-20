import { Document } from "mongoose";

export interface Schedule extends Document {
  id: string;
  title: string;
  day: string;
  time: Date;
  createdAt: string;
  updatedAt: string;
}
