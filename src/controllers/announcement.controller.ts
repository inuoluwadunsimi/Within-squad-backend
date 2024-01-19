import { type IExpressRequest } from "../interfaces";
import { type Request, type Response as ExpressResponse } from "express";
import * as ResponseManager from "../helpers/response.manager";
import * as announcementService from "../services/announcement.service";

export async function handleMakeAnnouncement(
  req: IExpressRequest,
  res: ExpressResponse
): Promise<void> {}
