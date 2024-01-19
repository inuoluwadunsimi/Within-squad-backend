import { CreatePaymentRequest } from "../interfaces/payment/payment.request";
import { PaymentDb } from "../models/payment";

export async function CreatePayment(
  payload: CreatePaymentRequest
): Promise<void> {
  const { name, amount, description, spaceId } = payload;

  await PaymentDb.create({
    name,
    amount,
    description,
    space: spaceId,
  });
}
