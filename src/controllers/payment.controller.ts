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
  const { paymentId, spaceId } = req.params;

  try {
    const paymentResponse = await paymentService.makePayment({
      user,
      paymentId,
      spaceId,
    });
    ResponseManager.success(res, { paymentResponse });
  } catch (err) {
    ResponseManager.handleError(res, err);
  }
}

export async function handleVerifyWebhook(
  req: IExpressRequest,
  res: ExpressResponse
): Promise<void> {
  const signature = req.headers["x-squad-encrypted-body"] as string;
  const body = req.body;

  try {
    await paymentService.verifySquadWebhook({
      body,
      signature,
    });
    ResponseManager.success(res, { message: "success" });
  } catch (err) {
    ResponseManager.handleError(res, err);
  }
}

export async function handleGetWallet(
  req: IExpressRequest,
  res: ExpressResponse
): Promise<void> {
  const { spaceId } = req.params;

  try {
    const wallet = await paymentService.getWallet(spaceId);
    ResponseManager.success(res, { wallet });
  } catch (err) {
    ResponseManager.handleError(res, err);
  }
}

export async function handleGetWalletTransactions(
  req: IExpressRequest,
  res: ExpressResponse
): Promise<void> {
  const { spaceId } = req.params;
  try {
    const transactions = await paymentService.getWalletTransactions(spaceId);
    ResponseManager.success(res, { transactions });
  } catch (err) {
    ResponseManager.handleError(res, err);
  }
}

export async function handleGetPaid(
  req: IExpressRequest,
  res: ExpressResponse
): Promise<void> {
  const { paymentId } = req.params;
  try {
    const paidMembers = await paymentService.getPaidMembers(paymentId);
    ResponseManager.success(res, { paidMembers });
  } catch (err) {
    ResponseManager.handleError(res, err);
  }
}

export async function handleGetAccountName(
  req: IExpressRequest,
  res: ExpressResponse
): Promise<void> {
  const { bank_name, account_number } = req.body;
  try {
    const AccountNameResponse = await paymentService.getAccountName({
      bank_name,
      account_number,
    });
    ResponseManager.success(res, { AccountNameResponse });
  } catch (err) {
    ResponseManager.handleError(res, err);
  }
}

export async function handleRequestOtp(
  req: IExpressRequest,
  res: ExpressResponse
): Promise<void> {
  const { spaceId } = req.params;
  const user = req.userId!;
  try {
    const otp = await paymentService.requestOtp(spaceId, user);
    ResponseManager.success(res, { otp });
  } catch (err) {
    ResponseManager.handleError(res, err);
  }
}

export async function handleWithdraw(
  req: IExpressRequest,
  res: ExpressResponse
): Promise<void> {
  const { spaceId } = req.params;
  const { otp, amount } = req.body;
  const user = req.userId!;
  try {
    await paymentService.Withdraw({
      user,
      space: spaceId,
      otp,
      amount,
    });
    ResponseManager.success(res, { message: "successfully withdrawn" });
  } catch (err) {
    ResponseManager.handleError(res, err);
  }
}
