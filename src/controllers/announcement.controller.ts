import { type IExpressRequest } from "../interfaces";
import { type Request, type Response as ExpressResponse } from "express";
import * as ResponseManager from "../helpers/response.manager";
import * as announcementService from "../services/announcement.service";

export async function handleMakeAnnouncement(
  req: IExpressRequest,
  res: ExpressResponse
): Promise<void> {
  const { spaceId } = req.params;
  const { title, description } = req.body;
  try {
    await announcementService.MakeAnnouncement({
      space: spaceId,
      title,
      description,
    });

    ResponseManager.success(res, { message: "announcement created" });
  } catch (err) {
    ResponseManager.handleError(res, err);
  }
}

export async function handleGetAnnouncements(
  req: IExpressRequest,
  res: ExpressResponse
): Promise<void> {
  const { spaceId } = req.params;

  try {
    const announcements = await announcementService.GetAnnouncments(spaceId);
    ResponseManager.success(res, { announcements });
  } catch (err) {
    ResponseManager.handleError(res, err);
  }
}
