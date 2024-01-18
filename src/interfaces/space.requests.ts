export interface CreateSpaceRequest {
  name: string;
  profileImage: string;
  description: string;
  user: string;
}

export interface JoinSpaceRequest {
  spaceCodeInput: string;
  spaceCode: string;
  user: string;
}
