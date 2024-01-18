import { Document } from "mongoose";

export interface Spaces extends Document {
  id: string;
  name: string;
  profileImage: string;
  description: string;
  spaceCode: string;
  owner: string;
  members: string;
  createdAt: string;
  updatedAt: string;
}
