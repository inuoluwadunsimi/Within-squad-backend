import { Document } from "mongoose";

export interface UserToken extends Document {
  id: string;
  token: string;
  email: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}
