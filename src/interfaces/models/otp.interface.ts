import { Document } from "mongoose";

export interface OTP extends Document {
  id: string;
  otp: string;
  space: string;
  email: string;
  expiresAt: Date;

  createdAt: string;
  updatedAt: string;
}

export interface WithdrawOtpConfirmation {
  user: string;
  otp: string;
  amount: number;
  space: string;
}
