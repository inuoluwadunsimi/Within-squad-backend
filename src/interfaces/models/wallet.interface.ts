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

export interface WalletTransactions extends Document {
  id: string;
  space: string;
  wallet: string;
  clerkType: string;
  reason: string;
  createdAt: string;
  updatedAt: string;
  amount: number;
}
