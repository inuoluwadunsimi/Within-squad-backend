import express from "express";
import { JwtHelper } from "../helpers/jwt/jwt.helper";
import { config } from "../constants/settings";
import { UserTokenDb } from "../models";
import { handleGetUser } from "../controllers";

const router = express.Router();
const jwtHelper = new JwtHelper({
  privateKey: config.jwtPrivateKey,
  UserTokenDb,
});

router.get("/me", jwtHelper.requirePermission(), handleGetUser);

export default router;
