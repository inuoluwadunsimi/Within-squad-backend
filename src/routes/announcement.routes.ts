import express from "express";

import { JwtHelper } from "../helpers/jwt/jwt.helper";
import { config } from "../constants/settings";
import { UserTokenDb } from "../models";
import {
  handleGetAnnouncements,
  handleMakeAnnouncement,
} from "../controllers/announcement.controller";

const router = express.Router({ mergeParams: true });
const jwtHelper = new JwtHelper({
  privateKey: config.jwtPrivateKey,
  UserTokenDb,
});

router.post("/", jwtHelper.requireAdminPermission(), handleMakeAnnouncement);
router.get("/", jwtHelper.requirePermission(), handleGetAnnouncements);

export default router;
