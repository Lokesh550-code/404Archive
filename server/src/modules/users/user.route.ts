import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { getMeController } from "./user.controller.js";

const router = Router();

router.get("/me", authenticate, getMeController);

export default router;
