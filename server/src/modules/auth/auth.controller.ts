import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  login,
  logout,
  refresh,
  registerUser,
  verifyEmail,
} from "./auth.service.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from "../../config/cookieOptions.js";
import path from "path";
import { ApiError } from "../../utils/ApiError.js";

export const registerUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, username, password } = res.locals.validatedData;

    const user = await registerUser(email, username, password);

    res
      .status(201)
      .json(new ApiResponse(201, "User registered successfully", user));
  },
);

export const verifyEmailController = asyncHandler(
  async (req: Request, res: Response) => {
    const { emailVerificationToken } = res.locals.validatedData;

    const user = await verifyEmail(emailVerificationToken);

    res
      .status(200)
      .json(new ApiResponse(200, "Email verification successful", user));
  },
);

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = res.locals.validatedData;

    const user = await login(email, password);

    res
      .status(200)
      .cookie("accessToken", user.accessToken, accessTokenCookieOptions)
      .cookie("refreshToken", user.refreshToken, refreshTokenCookieOptions)
      .json(
        new ApiResponse(200, "Login successful", {
          userId: user.userId,
          username: user.username,
          email: user.email,
        }),
      );
  },
);

export const logoutController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user;

    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    await logout(user.sub);

    res
      .status(200)
      .clearCookie("refreshToken", { path: "/api/v1/auth/refresh" })
      .clearCookie("accessToken")
      .json(new ApiResponse(200, "Logout successful"));
  },
);

export const refreshController = asyncHandler(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies ?? {};

    if (!refreshToken) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const { accessToken, generatedRefreshToken } = await refresh(refreshToken);

    res
      .status(200)
      .cookie("accessToken", accessToken, accessTokenCookieOptions)
      .cookie("refreshToken", generatedRefreshToken, refreshTokenCookieOptions)
      .json(
        new ApiResponse(200, "Refresh and access token generation successful"),
      );
  },
);
