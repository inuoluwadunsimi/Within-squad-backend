export interface Receiver {
  id: string;
  type: ProviderType;

  GeneratePaymentLink: (body: PaymentRequest) => Promise<PaymentResponse>;
}

export enum ProviderType {
  SENDER = "SENDER",
  RECEIVER = "RECEIVER",
}

export interface PaymentRequest {
  amount: number;
  currency?: string;
  email: string;
  tx_ref: string;
}

export interface ChargeCardRequest {
  amount: number;
  authorization: string;
  email: string;
  tx_ref: string;
}

export interface PaymentResponse {
  paymentLink: string;
  accessCode?: string;
  status: any;
}
