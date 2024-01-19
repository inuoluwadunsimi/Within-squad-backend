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
      payment: "payments",
      paymentAttempt: "paymentAttempts",
      wallet: "wallets",
      walletTransactions: "wallet_transactions",
    },
  },

  notifications: {
    expo_access_token: process.env["EXPO_TOKEN"],
  },
  squad: {
    secretKey: process.env["SQUAD_SECRET_KEY"] as string,
    publicKey: process.env["SQUAD_PUBLIC_KEY"] as string,
  },
};
