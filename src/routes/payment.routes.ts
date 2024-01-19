import express from "express";
import { JwtHelper } from "../helpers/jwt/jwt.helper";
import { config } from "../constants/settings";
import { UserTokenDb } from "../models";

const router = express.Router({ mergeParams: true });
const jwtHelper = new JwtHelper({
  privateKey: config.jwtPrivateKey,
  UserTokenDb,
});

router.post("/", jwtHelper.requireAdminPermission());
router.get("/", jwtHelper.requirePermission());
router.get("/:paymentId", jwtHelper.requirePermission());
router.post("/:paymentId/pay", jwtHelper.requirePermission());

export default router;
