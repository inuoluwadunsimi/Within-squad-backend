import { BadRequestError, User } from "../interfaces";
import { UserDb } from "../models";

export async function getUser(user: string): Promise<User> {
  const userDetails = await UserDb.findOne<User>({ _id: user });

  if (!userDetails) {
    throw new BadRequestError("no user found");
  }
  return userDetails;
}
