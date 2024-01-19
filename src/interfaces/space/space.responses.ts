import { Spaces } from "../models/space.interface";

export interface GetAllSpacesResponse {
  mySpaces: Spaces[];
  memberSpaces: Spaces[];
}

export interface CreateSpaceResponse {
  spaceId: string;
  name: string;
  spaceCode: string;
}
