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

export async function handleGetSpace(
  req: IExpressRequest,
  res: ExpressResponse
): Promise<void> {
  const { spaceId } = req.params;
  try {
    const space = await spaceService.getSpace(spaceId);
    ResponseManager.success(res, { space });
  } catch (err: any) {
    ResponseManager.handleError(res, err);
  }
}

export async function handleGetAllSpaces(
  req: IExpressRequest,
  res: ExpressResponse
): Promise<void> {
  const user = req.userId!;
  try {
    const spaces = await spaceService.getAllSpaces(user);
    ResponseManager.handleError(res, { spaces });
  } catch (err: any) {
    ResponseManager.handleError(res, err);
  }
}

export async function handleJoinSpace(
  req: IExpressRequest,
  res: ExpressResponse
): Promise<void> {
  const user = req.userId!;
  const { spaceCode } = req.query;
  const { spaceCodeInput } = req.body;
  try {
    await spaceService.joinSpace({
      user,
      spaceCodeInput,
      spaceCode: <string>spaceCode,
    });

    ResponseManager.success(res, { message: "successfully joined space" });
  } catch (err: any) {
    ResponseManager.handleError(res, err);
  }
}
