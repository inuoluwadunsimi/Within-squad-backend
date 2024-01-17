// This is where i set config for mongodb etc

import * as dotenv from 'dotenv'




export const config = {
    jwtPrivateKey: <string>process.env.JWT_PRIVATE_KEY,
    mongodb: {
      uri: <string>process.env.MONGODB_URI,
      collections: {
       sample:'sample-collection',
       user:'users',
       userAuth:'user_auths'
      }
    },
    google: {
      clientID: <string>process.env.GOOGLE_CLIENT_ID
    },
    redis: {
      uri: <string>process.env.REDIS_URI
    }
  };
  