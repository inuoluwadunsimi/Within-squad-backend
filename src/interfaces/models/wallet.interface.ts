import { Document } from "mongoose";

export interface Wallet extends Document {
  id: string;
  space: string;
  available_balance: number;
  pending_balance: number;
  lock_withdrawals: number;
  createdAt: string;
  updatedAt: string;
}
