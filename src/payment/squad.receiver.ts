import {
  ProviderType,
  Receiver,
  PaymentRequest,
  PaymentResponse,
} from "./receiver";
import axios from "axios";
import { config } from "../constants/settings";
import { ServiceUnavailableError } from "../interfaces";
import {
  AccountLookupInterface,
  AccountLookupResult,
  WithdrawalRequest,
} from "../interfaces/payment/payment.request";
import { BanksByName } from "./account.codes";

const baseUrl = "https://sandbox-api-d.squadco.com/";

export class SquadReceiver implements Receiver {
  id = "squad";
  type = ProviderType.RECEIVER;

  async GeneratePaymentLink(body: PaymentRequest): Promise<PaymentResponse> {
    try {
      const { amount, email, tx_ref } = body;

      console.log("");

      const response = await axios.post(
        "https://sandbox-api-d.squadco.com/transaction/initiate",
        {
          email,
          amount: amount * 100,
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
      console.log(response);

      if (response.status !== 200) {
        // console.log(response.data);
        throw new ServiceUnavailableError("service unavailable");
      }

      return {
        paymentLink: response.data.data.checkout_url,
        status: response.data.status,
      };
    } catch (err) {
      // console.error(err);
      throw {
        code: 500,
        data: err,
      };
    }
  }

  async accountLookup(
    body: AccountLookupInterface
  ): Promise<AccountLookupResult> {
    try {
      const { bank_name, account_number } = body;

      const bank_code = BanksByName[bank_name];

      const response = await axios.post(
        `${baseUrl}/payout/account/lookup`,
        {
          bank_code,
          account_number,
        },
        {
          headers: {
            Authorization: `Bearer ${config.squad.secretKey}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status !== 200) {
        new ServiceUnavailableError("service unavailable");
      }

      return {
        account_number: response.data.account_number,
        account_name: response.data.account_name,
        bank_code,
      };
    } catch (err) {
      console.error(err);
      throw {
        code: 500,
        data: err,
      };
    }
  }
  async Withdraw(body: WithdrawalRequest): Promise<void> {
    const { transaction_reference, amount, bank_name, account_number, remark } =
      body;

    const accountLookup = await this.accountLookup({
      bank_name,
      account_number,
    });

    const response = await axios.post(
      `${baseUrl}/payout/transfer`,
      {
        transaction_reference,
        amount,
        bank_code: accountLookup.bank_code,
        account_number,
        account_name: accountLookup.account_name,
        currency_id: "NGN",
        remark,
      },
      {
        headers: {
          Authorization: `Bearer ${config.squad.secretKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200) {
      console.log(response);
      new ServiceUnavailableError("service unavailable");
    }
  }
}
