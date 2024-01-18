// This is where i set config for mongodb etc

import * as dotenv from "dotenv";

export const config = {
  jwtPrivateKey: <string>process.env.JWT_PRIVATE_KEY,
  mongodb: {
    uri: <string>process.env.MONGODB_URI,
    collections: {
      user: "users",
      userAuth: "user_auths",
      notification: "notifications",
      userToken: "user_tokens",
      space: "spaces",
    },
  },
  google: {
    clientID: <string>process.env.GOOGLE_CLIENT_ID,
  },

  notifications: {
    expo_access_token: process.env["EXPO_TOKEN"],
  },
};
