import {
  BadRequestError,
  CreateSpaceRequest,
  GetAllSpacesResponse,
  JoinSpaceRequest,
  LeaveSpaceRequest,
  Spaces,
} from "../interfaces";
import { generateSpaceCode } from "../helpers/utils";
import { SpaceDb } from "../models/space";
import { WalletDb } from "../models/wallet";

export async function createSpace(body: CreateSpaceRequest): Promise<void> {
  const { name, description, profileImage, user } = body;

  const code = await generateSpaceCode();

  const space = await SpaceDb.create({
    name,
    profileImage,
    description,
    spaceCode: code,
    owner: user,
  });

  await WalletDb.create({
    space: space.id,
  });
}

export async function getSpace(spaceId: string): Promise<Spaces> {
  const space = await SpaceDb.findOne<Spaces>({ _id: spaceId }).populate([
    "owner",
    "members",
  ]);
  if (!space) {
    throw new BadRequestError("space not found");
  }
  return space;
}

export async function getAllSpaces(
  user: string
): Promise<GetAllSpacesResponse> {
  const mySpaces = await SpaceDb.find<Spaces>({ owner: user }).populate([
    "owner",
    "members",
  ]);

  const memberSpaces = await SpaceDb.find<Spaces>({
    member: { $in: [user] },
  }).populate(["owner", "members"]);

  return {
    mySpaces,
    memberSpaces,
  };
}

export async function joinSpace(body: JoinSpaceRequest): Promise<void> {
  const { spaceCode, user, spaceCodeInput } = body;

  const space = await SpaceDb.findOne<Spaces>({
    $or: [{ spaceCode: spaceCode }, { spaceCode: spaceCodeInput }],
  });

  if (!space) {
    throw new BadRequestError("space code invalid");
  }

  space.members.push(user);
}

export async function leaveSpace(body: LeaveSpaceRequest): Promise<void> {
  const { user, spaceId } = body;

  await SpaceDb.updateOne(
    { _id: spaceId },
    {
      $pull: { members: user },
    }
  );
}
