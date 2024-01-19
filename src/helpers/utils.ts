import { SpaceDb } from "../models/space";
import crypto from "crypto";
import * as randomString from "randomstring";

export async function generateSpaceCode() {
  const existingCodes = await SpaceDb.distinct("spaceCode");

  while (true) {
    const code = crypto
      .randomBytes(3)
      .toString("hex")
      .toUpperCase()
      .slice(0, 6);
    if (!existingCodes.includes(code)) {
      return code;
    }
  }
}

export function generateOtp(): string {
  return randomString.generate({
    length: 6,
    charset: "numeric",
  });
}
