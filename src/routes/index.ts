import express from "express";
import { routeError } from "../handlers";
import authRoutes from "./auth.routes";
import spaceRoutes from "./space.routes";

import { MainApiValidator } from "../middlewares/openapi.validator";

const router: express.Router = express.Router();

router.use("/", MainApiValidator);
router.use("/user/auth", authRoutes);
router.use("/spaces", spaceRoutes);

router.use("/health", (req, res) => {
  res.send({ status: "OK" });
});

router.post("/webhooks");

router.use(routeError);

export default router;
