import { Router } from "express";
import {
  loginController,
  logoutController,
  refreshController,
  registerUserController,
  forgotPasswordController,
  verifyEmailController,
} from "./auth.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  loginValidator,
  passwordResetRequestValidator,
  registerUserValidator,
  verifyEmailValidator,
} from "./auth.validatator.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/register",
  validate(registerUserValidator, "body"),
  registerUserController,
);

router.get(
  "/verify-email/:emailVerificationToken",
  validate(verifyEmailValidator, "params"),
  verifyEmailController,
);

router.post("/login", validate(loginValidator, "body"), loginController);

router.post("/logout", authenticate, logoutController);

router.post("/refresh", refreshController);

router.post(
  "/forgot-password",
  validate(passwordResetRequestValidator, "body"),
  forgotPasswordController,
);

export default router;
