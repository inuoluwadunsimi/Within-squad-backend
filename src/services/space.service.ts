import { JoinSpaceRequest } from "../interfaces";
import { v4 as uuidv4 } from "uuid";
import { generateSpaceCode } from "../helpers/utils";
import { SpaceDb } from "../models/space";

function genUUID() {
  return uuidv4();
}

export async function createSpace(body: JoinSpaceRequest): Promise<void> {
  const { name, description, profileImage, user } = body;

  const code = await generateSpaceCode();

  await SpaceDb.create({
    name,
    profileImage,
    description,
    spaceCode: code,
    owner: user,
  });
}
