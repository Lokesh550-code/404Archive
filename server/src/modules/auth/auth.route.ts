import { Router } from "express";
import { registerUserController } from "./auth.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { registerUserValidator } from "./auth.validatator.js";

const router = Router();

router.post(
  "/register",
  validate(registerUserValidator, "body"),
  registerUserController,
);

export default router;
