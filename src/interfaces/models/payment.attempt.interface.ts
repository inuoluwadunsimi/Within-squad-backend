import { Document } from "mongoose";

export interface PaymentAttempt extends Document {
  id: string;
  payment: string;
  user: string;
  status: string;
  transaction_reference: string;
  createdAt: string;
  frustratedAt: string;
  space: string;
  amount: number;
}
