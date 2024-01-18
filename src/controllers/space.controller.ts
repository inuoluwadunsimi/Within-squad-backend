import { type IExpressRequest } from "../interfaces";
import { type Request, type Response as ExpressResponse } from "express";
import * as ResponseManager from "../helpers/response.manager";
import * as spaceService from "../services/space.service";

export async function handleCreateSpace(
  req: IExpressRequest,
  res: ExpressResponse
): Promise<void> {
  const { name, description, profileImage } = req.body;
  const user = req.userId!;
  try {
    await spaceService.createSpace({
      name,
      description,
      profileImage,
      user,
    });
    ResponseManager.success(res, { message: "space successfully created" });
  } catch (err: any) {
    ResponseManager.handleError(res, err);
  }
}
