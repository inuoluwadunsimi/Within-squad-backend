import express from "express";
import {
  handleCreateSpace,
  handleGetAllSpaces,
  handleGetSpace,
  handleJoinSpace,
  handleLeaveSpace,
} from "../controllers";
import { JwtHelper } from "../helpers/jwt/jwt.helper";
import { config } from "../constants/settings";
import { UserTokenDb } from "../models";

const router = express.Router();
const jwtHelper = new JwtHelper({
  privateKey: config.jwtPrivateKey,
  UserTokenDb,
});

router.post("/space", jwtHelper.requirePermission(), handleCreateSpace);
router.get("/space/:spaceId", jwtHelper.requirePermission(), handleGetSpace);
router.get("/", jwtHelper.requirePermission(), handleGetAllSpaces);
router.post("/space/join", jwtHelper.requirePermission(), handleJoinSpace);
router.put(
  "/space/:spaceId/leave",
  jwtHelper.requirePermission(),
  handleLeaveSpace
);

export default router;
