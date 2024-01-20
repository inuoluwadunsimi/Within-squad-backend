import express from "express";
import { routeError } from "../handlers";
import authRoutes from "./auth.routes";
import spaceRoutes from "./space.routes";
import userRoutes from "./user.routes";
import announcementRoutes from "./announcement.routes";

import { MainApiValidator } from "../middlewares/openapi.validator";
import { handleVerifyWebhook } from "../controllers";

const router: express.Router = express.Router();

router.use("/", MainApiValidator);
router.use("/user", userRoutes);
router.use("/user/auth", authRoutes);
router.use("/spaces", spaceRoutes);
router.use("/spaces/space", announcementRoutes);

router.use("/health", (req, res) => {
  res.send({ status: "OK" });
});

router.post("/webhooks", handleVerifyWebhook);

router.use(routeError);

export default router;
