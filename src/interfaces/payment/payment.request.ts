import { BanksByName } from "../../payment/account.codes";
export interface CreatePaymentRequest {
  name: string;
  description: string;
  amount: string;
  spaceId: string;
  dueDate: Date;
}

export interface GetAllPaymentRequest {
  spaceId: string;
  dueDate: string;
}

export enum PaymentStatus {
  FAILED = "FAILED",
  SUCCESS = "SUCCESS",
  PENDING = "PENDING",
}

export interface MakePaymentRequest {
  user: string;
  paymentId: string;
}

export interface AccountLookupInterface {
  bank_name: keyof typeof BanksByName;
  account_number: string;
}

export interface AccountLookupResult {
  account_name: string;
  account_number: string;
  bank_code: string;
}

export interface WithdrawalRequest extends AccountLookupInterface {
  transaction_reference: string;
  amount: string;
  remark: string;
}
