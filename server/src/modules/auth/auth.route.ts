import { Router } from "express";
import {
  loginController,
  logoutController,
  refreshController,
  registerUserController,
  forgotPasswordController,
  verifyEmailController,
  resetPasswordController,
} from "./auth.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  loginValidator,
  passwordResetRequestValidator,
  registerUserValidator,
  resetPasswordValidator,
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

router.post(
  "/reset-password/:passwordResetToken",
  validate(resetPasswordValidator, "body"),
  resetPasswordController,
);

export default router;
