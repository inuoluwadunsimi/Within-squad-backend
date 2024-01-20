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
import paymentRoutes from "./payment.routes";
import {
  handleCreateSchedule,
  handleGetAllSchedules,
} from "../controllers/schedules.controllers";

const router = express.Router({ mergeParams: true });
const jwtHelper = new JwtHelper({
  privateKey: config.jwtPrivateKey,
  UserTokenDb,
});

router.use("/space/:spaceId/payment", paymentRoutes);

router.post("/space", jwtHelper.requirePermission(), handleCreateSpace);
router.get("/space/:spaceId", jwtHelper.requirePermission(), handleGetSpace);
router.post(
  "/space/:spaceId/schedules",
  jwtHelper.requireAdminPermission(),
  handleCreateSchedule
);
router.get(
  "/space/:spaceId/schedules",
  jwtHelper.requirePermission(),
  handleGetAllSchedules
);
router.get("/", jwtHelper.requirePermission(), handleGetAllSpaces);
router.post("/space/join", jwtHelper.requirePermission(), handleJoinSpace);
router.put(
  "/space/:spaceId/leave",
  jwtHelper.requirePermission(),
  handleLeaveSpace
);

export default router;
