import { type IExpressRequest } from "../interfaces";
import { type Request, type Response as ExpressResponse } from "express";
import * as ResponseManager from "../helpers/response.manager";
import * as scheduleService from "../services/schedules.service";

export async function handleCreateSchedule(
  req: IExpressRequest,
  res: ExpressResponse
): Promise<void> {
  const { spaceId } = req.params;
  const { title, day, time } = req.body;

  try {
    await scheduleService.CreateSchedule({
      spaceId,
      title,
      day,
      time,
    });
    ResponseManager.success(res, { message: "successfully" });
  } catch (err) {
    ResponseManager.handleError(res, err);
  }
}

export async function handleGetAllSchedules(
  req: IExpressRequest,
  res: ExpressResponse
): Promise<void> {
  const { spaceId } = req.params;

  try {
    const schedules = await scheduleService.getAllSchedules(spaceId);
    ResponseManager.success(res, { schedules });
  } catch (err) {
    ResponseManager.handleError(res, err);
  }
}
