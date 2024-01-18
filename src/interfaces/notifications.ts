import { type Document } from "mongoose";

export interface Notification extends Document {
  id: string;
  expoToken: string;
  title: string;
  body: string;
  date: Date;
  user: string;
  error: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SendNotificationRequest {
  title: string;
  body: string;
}

export interface ExpoMessage {
  expoToken?: string;
  title: string;
  data?: object;
  body: string;
  user: string;
  error: boolean;
}
