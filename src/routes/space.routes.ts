import express from "express";
import { handleCreateSpace, handleGetSpace } from "../controllers";
import { JwtHelper } from "../helpers/jwt/jwt.helper";
import { config } from "../constants/settings";
import { UserTokenDb } from "../models";

const router = express.Router();
const jwtHelper = new JwtHelper({
  privateKey: config.jwtPrivateKey,
  UserTokenDb,
});

router.post("/space", jwtHelper.requirePermission(), handleCreateSpace);
router.get("/space/:spaceId", jwtHelper.requirePermission, handleGetSpace);

export default router;
