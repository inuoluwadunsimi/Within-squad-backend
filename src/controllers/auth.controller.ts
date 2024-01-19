import { type IExpressRequest } from "../interfaces";
import { type Request, type Response as ExpressResponse } from "express";
import * as ResponseManager from "../helpers/response.manager";
import * as authService from "../services/auth.service";

export async function handleSignup(
  req: IExpressRequest,
  res: ExpressResponse
): Promise<void> {
  const {
    fullName,
    password,
    regNo,
    dateOfBirth,
    department,
    level,
    expoToken,
    email,
  } = req.body;

  try {
    const authResponse = await authService.signup({
      email,
      fullName,
      password,
      regNo,
      dateOfBirth,
      department,
      level,
      expoToken,
    });

    ResponseManager.success(res, { authResponse });
  } catch (err: any) {
    ResponseManager.handleError(res, err);
  }
}

export async function handleLogin(
  req: IExpressRequest,
  res: ExpressResponse
): Promise<void> {
  const { email, password } = req.body;

  try {
    const authResponse = await authService.login({
      email,
      password,
    });

    ResponseManager.success(res, { authResponse });
  } catch (err: any) {
    ResponseManager.handleError(res, err);
  }
}
