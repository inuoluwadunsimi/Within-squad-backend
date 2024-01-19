import { Spaces } from "../models/space.interface";

export interface GetAllSpacesResponse {
  mySpaces: Spaces[];
  memberSpaces: Spaces[];
}
