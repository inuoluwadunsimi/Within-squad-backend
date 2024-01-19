import { IExpressRequest } from "../interfaces";
import { type Request, type Response as ExpressResponse } from "express";
import * as ResponseManager from "../helpers/response.manager";
import * as userService from "../services/user.service";

export async function handleGetUser(
  req: IExpressRequest,
  res: ExpressResponse
): Promise<void> {
  const user = req.userId!;

  try {
    const userDetails = await userService.getUser(user);

    ResponseManager.success(res, { userDetails });
  } catch (err: any) {
    ResponseManager.handleError(res, err);
  }
}
