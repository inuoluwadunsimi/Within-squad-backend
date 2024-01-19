import * as crypto from "crypto";
import { config } from "../constants/settings";

export function verifyWebhookSignature(
  body: Record<string, string | undefined>,
  signature: string
): boolean {
  const concatenatedData = JSON.stringify(body);
  const hash = crypto
    .createHmac("sha512", config.squad.secretKey)
    .update(concatenatedData)
    .digest("hex");
  return hash === signature;
}
