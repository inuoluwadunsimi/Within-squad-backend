import {
  AccountLookupResult,
  CreatePaymentRequest,
  GetAllPaymentRequest,
  MakePaymentRequest,
  PaymentStatus,
} from "../interfaces/payment/payment.request";
import { PaymentDb, PaymentAttemptDb } from "../models";
import {
  BadRequestError,
  Payment,
  PaymentAttempt,
  User,
  Wallet,
  WalletTransactions,
} from "../interfaces";
import { SquadReceiver } from "../payment/squad.receiver";
import { MakePaymentResponse } from "../interfaces/payment/payment.response";
import { v4 as uuidv4 } from "uuid";
import { UserDb } from "../models";
import { verifyWebhookSignature } from "../payment/helpers";
import { WalletDb } from "../models/wallet";
import { ClerkType, WalletTransactionDb } from "../models/wallet.transaction.";
import { AccountLookupInterface } from "../interfaces/payment/payment.request";
import { generateOtp } from "../helpers/utils";
import { OtpDb } from "../models/otp";
import {
  OTP,
  WithdrawOtpConfirmation,
} from "../interfaces/models/otp.interface";

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
  const { user, paymentId, spaceId } = payload;

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
    space: spaceId,
    amount: payment.amount,
  });

  return {
    paymentLink: response.paymentLink,
    name: userDetails.fullName,
    amount: payment.amount,
  };
}

export async function verifySquadWebhook(props: {
  body: any;
  signature: string;
}): Promise<void> {
  const { body, signature } = props;

  console.log(body);

  // condition for unsuccessful webhook not indicated because of issue with abscence in docs
  const isValidSignature = verifyWebhookSignature(body, signature);
  if (!isValidSignature) {
    throw new BadRequestError("invalid webhook signature");
  }

  const paymentAttempt = await PaymentAttemptDb.findOne<PaymentAttempt>({
    transaction_reference: body.Body.transaction_ref,
  });
  if (!paymentAttempt) {
    throw new BadRequestError("no transaction with this reference");
  }

  paymentAttempt.status = PaymentStatus.SUCCESS;
  await paymentAttempt.save();

  const wallet = await WalletDb.findOneAndUpdate<Wallet>(
    { space: paymentAttempt.space },
    { $inc: { available_balance: paymentAttempt.amount } }
  );

  if (!wallet) {
    console.log("wahala wahala");
    new BadRequestError("wallet error");
  }
  await WalletTransactionDb.create({
    space: paymentAttempt.space,
    wallet: wallet!.id,
    status: PaymentStatus.SUCCESS,
    clerkType: ClerkType.CREDIT,
    reason: `payment from ${paymentAttempt.user} `,
    amount: paymentAttempt.amount,
  });
  return;
}

export async function getWallet(spaceId: string): Promise<Wallet> {
  const wallet = await WalletDb.findOne<Wallet>({
    space: spaceId,
  });

  if (!wallet) {
    throw new BadRequestError("no waalet found for this space");
  }

  return wallet;
}

export async function getWalletTransactions(
  spaceId: string
): Promise<WalletTransactions[]> {
  const walletTransactions = await WalletTransactionDb.find<WalletTransactions>(
    {
      space: spaceId,
    }
  ).select("-space -wallet -status ");

  return walletTransactions;
}

export async function getPaidMembers(
  paymentId: string
): Promise<PaymentAttempt[]> {
  const payments = await PaymentAttemptDb.find<PaymentAttempt>({
    status: PaymentStatus.SUCCESS,
    payment: paymentId,
  })
    .select("user")
    .populate("user");
  return payments;
}

export async function getAccountName(
  body: AccountLookupInterface
): Promise<AccountLookupResult> {
  return payWithSquad.accountLookup(body);
}

export async function requestOtp(
  spaceId: string,
  user: string
): Promise<string> {
  const otp = generateOtp();

  await OtpDb.create({
    otp,
    user,
    space: spaceId,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  return otp;
}

export async function Withdraw(body: WithdrawOtpConfirmation): Promise<void> {
  const { user, space, otp, amount } = body;

  const otpCorrect = await OtpDb.findOne<OTP>({
    user,
    space,
    otp,
  });
  if (!otpCorrect) {
    throw new BadRequestError("otp is incorrect");
  }

  const wallet = await WalletDb.findOne<Wallet>({ space });
  if (!wallet) {
    throw new BadRequestError("no wallet found");
  }

  if (wallet.available_balance < amount) {
    throw new BadRequestError("balance is low");
  }
  wallet.available_balance -= amount;

  await WalletTransactionDb.create({
    space,
    wallet: wallet.id,
    status: PaymentStatus.SUCCESS,
    clerkType: ClerkType.DEBIT,
    amount,
  });
}
