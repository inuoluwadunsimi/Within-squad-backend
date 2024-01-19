import express from "express";
import { JwtHelper } from "../helpers/jwt/jwt.helper";
import { config } from "../constants/settings";
import { UserTokenDb } from "../models";
import {
  handleCreatePayment,
  handleGetAllPayments,
  handleGetSinglePayment,
  handleMakePayment,
} from "../controllers/payment.controller";

const router = express.Router({ mergeParams: true });
const jwtHelper = new JwtHelper({
  privateKey: config.jwtPrivateKey,
  UserTokenDb,
});

router.post("/", jwtHelper.requireAdminPermission(), handleCreatePayment);
router.get("/", jwtHelper.requirePermission(), handleGetAllPayments);
router.get(
  "/:paymentId",
  jwtHelper.requirePermission(),
  handleGetSinglePayment
);
router.post(
  "/:paymentId/pay",
  jwtHelper.requirePermission(),
  handleMakePayment
);

export default router;
