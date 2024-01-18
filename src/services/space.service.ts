import { BadRequestError, CreateSpaceRequest, Spaces } from "../interfaces";
import { generateSpaceCode } from "../helpers/utils";
import { SpaceDb } from "../models/space";

export async function createSpace(body: CreateSpaceRequest): Promise<void> {
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

export async function getSpace(spaceId: string): Promise<Spaces> {
  const space = await SpaceDb.findOne<Spaces>({ _id: spaceId });
  if (!space) {
    throw new BadRequestError("space not found");
  }
  return space;
}
