export interface JwtConfig {
  privateKey: string;
  handleJsonResponse?: Function;
  UserTokenDb: any;
}

export enum JwtType {
  USER = "USER",
  SPACE_OWNER = "SPACE_OWNER",
}
