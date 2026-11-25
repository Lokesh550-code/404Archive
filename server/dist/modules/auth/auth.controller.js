import { asyncHandler } from "../../utils/asyncHandler.js";
import { registerUser, verifyEmail } from "./auth.service.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
export const registerUserController = asyncHandler(async (req, res) => {
    const { email, username, password } = res.locals.validatedData;
    const user = await registerUser(email, username, password);
    res
        .status(201)
        .json(new ApiResponse(201, "User registered successfully", user));
});
export const verifyEmailController = asyncHandler(async (req, res) => {
    const { emailVerificationToken } = res.locals.validatedData;
    const user = await verifyEmail(emailVerificationToken);
    res
        .status(200)
        .json(new ApiResponse(200, "Email verification successful", user));
});
