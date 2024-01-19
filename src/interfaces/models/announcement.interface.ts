import { Document } from "mongoose";

export interface Announcement extends Document {
  id: string;
  space: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface MakeAnnouncementRequest {
  title: string;
  space: string;
  description: string;
}
