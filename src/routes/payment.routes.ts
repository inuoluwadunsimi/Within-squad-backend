import express from "express";
import { JwtHelper } from "../helpers/jwt/jwt.helper";
import { config } from "../constants/settings";
import { UserTokenDb } from "../models";
import {
  handleCreatePayment,
  handleGetAllPayments,
  handleGetPaid,
  handleGetSinglePayment,
  handleGetWallet,
  handleGetWalletTransactions,
  handleMakePayment,
} from "../controllers";

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

router.get("/wallet", jwtHelper.requireAdminPermission(), handleGetWallet);
router.get(
  "/wallet/transactions",
  jwtHelper.requireAdminPermission(),
  handleGetWalletTransactions
);

router.get(
  "/:paymentId/pay",
  jwtHelper.requireAdminPermission(),
  handleGetPaid
);
export default router;
