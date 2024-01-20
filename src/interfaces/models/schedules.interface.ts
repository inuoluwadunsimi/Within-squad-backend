import { Document } from "mongoose";

export interface Schedule extends Document {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  space: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateScheduleInterface {
  title: string;
  startDate: Date;
  endDate: Date;
  spaceId: string;
}
