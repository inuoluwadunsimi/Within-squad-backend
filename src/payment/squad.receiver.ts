import {
  ProviderType,
  Receiver,
  PaymentRequest,
  PaymentResponse,
} from "./receiver";
import axios from "axios";
import { config } from "../constants/settings";
import { ServiceUnavailableError } from "../interfaces";

const baseUrl = "https://sandbox-api-d.squadco.com/transaction/";

export class SquadReceiver implements Receiver {
  id = "squad";
  type = ProviderType.RECEIVER;

  async GeneratePaymentLink(body: PaymentRequest): Promise<PaymentResponse> {
    try {
      const { amount, email, tx_ref } = body;

      const response = await axios.post(
        `${baseUrl}/initiate`,
        {
          email,
          amount,
          initiate_type: "inline",
          currency: "NGN",
          transaction_ref: tx_ref,
          pass_charge: true,
        },
        {
          headers: {
            Authorization: `Bearer ${config.squad.secretKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200) {
        throw new ServiceUnavailableError("service unavailable");
      }

      return {
        paymentLink: response.data.checkout_url,
        status: response.data.status,
      };
    } catch (err) {
      console.error(err);
      throw {
        code: 500,
        data: err,
      };
    }
  }
}
