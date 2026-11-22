import express from "express";
import { healthController } from "./health.controller.js";

const router = express.Router();

router.all("/", healthController);

export default router;
