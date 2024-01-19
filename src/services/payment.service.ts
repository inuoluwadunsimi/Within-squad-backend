import {
  CreatePaymentRequest,
  GetAllPaymentRequest,
  MakePaymentRequest,
} from "../interfaces/payment/payment.request";
import { PaymentDb } from "../models/payment";
import { BadRequestError, Payment, User } from "../interfaces";
import { SquadReceiver } from "../payment/squad.receiver";
import { MakePaymentResponse } from "../interfaces/payment/payment.response";
import { v4 as uuidv4 } from "uuid";
import { UserDb } from "../models";
import { PaymentAttemptDb } from "../models/payment.attempt";

const payWithSquad = new SquadReceiver();

function genUUID() {
  return uuidv4();
}

export async function CreatePayment(
  payload: CreatePaymentRequest
): Promise<void> {
  const { name, amount, description, spaceId, dueDate } = payload;

  await PaymentDb.create({
    name,
    amount,
    description,
    space: spaceId,
    dueDate,
  });
}

export async function getAllPayments(
  payload: GetAllPaymentRequest
): Promise<Payment[]> {
  const { spaceId, dueDate } = payload;
  const payments = await PaymentDb.find<Payment>({ space: spaceId }).sort({
    createdAt: -1,
  });
  if (dueDate) {
    const payments = await PaymentDb.find<Payment>({ space: spaceId }).sort({
      dueDate: -1,
    });
    return payments;
  }

  return payments;
}

export async function getSinglePayment(paymentId: string): Promise<Payment> {
  const payment = await PaymentDb.findOne<Payment>({ _id: paymentId });
  if (!payment) {
    throw new BadRequestError("no payment found");
  }
  return payment;
}

export async function makePayment(
  payload: MakePaymentRequest
): Promise<MakePaymentResponse> {
  const { user, paymentId } = payload;

  const tx_ref = genUUID();

  const payment = await PaymentDb.findOne<Payment>({ _id: paymentId });
  if (!payment) {
    throw new BadRequestError("payment not found");
  }

  const userDetails = await UserDb.findOne<User>({ _id: user });
  if (!userDetails) {
    throw new BadRequestError("user details not found");
  }

  const response = await payWithSquad.GeneratePaymentLink({
    amount: payment.amount,
    email: userDetails.email,
    tx_ref,
  });

  await PaymentAttemptDb.create({
    payment: paymentId,
    user,
    transaction_reference: tx_ref,
  });

  return {
    paymentLink: response.paymentLink,
    name: userDetails.fullName,
    amount: response.paymentLink,
  };
}
