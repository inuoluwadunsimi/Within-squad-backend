import { Document } from "mongoose";

export interface Payment extends Document {
  id: string;
  name: string;
  description: string;
  amount: number;
  space: string;
  createdAt: string;
  updatedAt: string;
}
