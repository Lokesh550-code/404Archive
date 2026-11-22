import express from "express";
import { getHealth } from "./health.controller.js";

const router = express.Router();

router.all("/", getHealth);

export default router;
