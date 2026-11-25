import { Router } from "express";
import { loginController, registerUserController, verifyEmailController, } from "./auth.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { loginValidator, registerUserValidator, verifyEmailValidator, } from "./auth.validatator.js";
const router = Router();
router.post("/register", validate(registerUserValidator, "body"), registerUserController);
router.post("/verify-email/:emailVerificationToken", validate(verifyEmailValidator, "params"), verifyEmailController);
router.post("/login", validate(loginValidator, "body"), loginController);
export default router;
