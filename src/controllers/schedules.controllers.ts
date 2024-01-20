import { type IExpressRequest } from "../interfaces";
import { type Request, type Response as ExpressResponse } from "express";
import * as ResponseManager from "../helpers/response.manager";

export async function handleCreateSchedule(
  req: IExpressRequest,
  res: ExpressResponse
): Promise<void> {
  try {
  } catch (err) {
    ResponseManager.handleError(res, err);
  }
}
