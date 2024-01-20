import { Announcement, MakeAnnouncementRequest } from "../interfaces";
import { AnnouncementDb } from "../models";

export async function MakeAnnouncement(
  body: MakeAnnouncementRequest
): Promise<void> {
  const { title, description, space } = body;

  await AnnouncementDb.create({
    title,
    description,
    space,
  });
}

export async function GetAnnouncments(
  spaceId: string
): Promise<Announcement[]> {
  const announcements = await AnnouncementDb.find<Announcement>({
    space: spaceId,
  }).sort({ createdAt: -1 });
  return announcements;
}
