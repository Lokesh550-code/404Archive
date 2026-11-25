import { Router } from "express";
import {
  registerUserController,
  verifyEmailController,
} from "./auth.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  registerUserValidator,
  verifyEmailValidator,
} from "./auth.validatator.js";

const router = Router();

router.post(
  "/register",
  validate(registerUserValidator, "body"),
  registerUserController,
);

router.post(
  "/verify-email/:emailVerificationToken",
  validate(verifyEmailValidator, "params"),
  verifyEmailController,
);

export default router;
