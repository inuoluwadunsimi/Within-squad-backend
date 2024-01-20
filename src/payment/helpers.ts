import * as crypto from "crypto";
import { config } from "../constants/settings";

export function verifyWebhookSignature(
  body: Record<string, string | undefined>,
  signature: string
): boolean {
  const hash = crypto
    .createHmac("sha512", config.squad.secretKey)
    .update(JSON.stringify(body))
    .digest("hex")
    .toUpperCase();
  return hash === signature;
}
