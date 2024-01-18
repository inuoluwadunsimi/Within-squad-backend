import { SpaceDb } from "../models/space";
import { Spaces } from "../interfaces";
import crypto from "crypto";

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
