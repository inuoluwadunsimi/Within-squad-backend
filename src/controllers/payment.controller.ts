import { type IExpressRequest } from "../interfaces";
import { type Request, type Response as ExpressResponse } from "express";
import * as ResponseManager from "../helpers/response.manager";
import * as paymentService from "../services/payment.service";

export async function handleCreatePayment(
  req: IExpressRequest,
  res: ExpressResponse
): Promise<void> {
  const { spaceId } = req.params;
  const { name, description, amount, dueDate } = req.body;
  try {
    await paymentService.CreatePayment({
      name,
      description,
      spaceId,
      amount,
      dueDate,
    });

    ResponseManager.success(res, { message: "payment successfully created" });
  } catch (err: any) {
    ResponseManager.handleError(res, err);
  }
}

export async function handleGetAllPayments(
  req: IExpressRequest,
  res: ExpressResponse
): Promise<void> {
  const { spaceId } = req.params;
  const { dueDate } = req.query;
  try {
    const payments = await paymentService.getAllPayments({
      spaceId,
      dueDate: <string>dueDate,
    });
    ResponseManager.success(res, { payments });
  } catch (err: any) {
    ResponseManager.handleError(res, err);
  }
}

export async function handleGetSinglePayment(
  req: IExpressRequest,
  res: ExpressResponse
): Promise<void> {
  const { paymentId } = req.params;
  try {
    const payment = await paymentService.getSinglePayment(paymentId);
    ResponseManager.success(res, { payment });
  } catch (err) {
    ResponseManager.handleError(res, { err });
  }
}

export async function handleMakePayment(
  req: IExpressRequest,
  res: ExpressResponse
): Promise<void> {
  const user = req.userId!;
  const { paymentId } = req.params;

  try {
    const paymentResponse = await paymentService.makePayment({
      user,
      paymentId,
    });
    ResponseManager.success(res, { paymentResponse });
  } catch (err) {
    ResponseManager.handleError(res, err);
  }
}
