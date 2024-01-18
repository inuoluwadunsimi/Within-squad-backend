import express from "express";
import { handleCreateSpace } from "../controllers";

const router = express.Router();

router.post("/space", handleCreateSpace);

export default router;
