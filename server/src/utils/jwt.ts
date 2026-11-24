import { config } from "../config/env.js";
import jwt from "jsonwebtoken";
import { AccessTokenPayload } from "../types/accessTokenPayload.js";
import { RefreshTokenPayload } from "../types/refreshTokenPayload.js";
import { ApiError } from "./ApiError.js";

export const generateAccessToken = (payload: AccessTokenPayload) => {
  return jwt.sign(
    { sub: payload.sub, role: payload.role },
    config.ACCESS_SECRET,
    {
      algorithm: "HS256",
      expiresIn: "15m",
    },
  );
};

export const verifyAccessToken = (accessToken: string): AccessTokenPayload => {
  try {
    const decoded = jwt.verify(accessToken, config.ACCESS_SECRET, {
      algorithms: ["HS256"],
    });

    if (
      decoded === null ||
      typeof decoded !== "object" ||
      typeof decoded.sub !== "string" ||
      typeof decoded.role !== "string" ||
      !["user", "admin", "moderator"].includes(decoded.role)
    ) {
      throw new ApiError(401, "Invalid access token");
    }

    return decoded as AccessTokenPayload;
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }

    throw new ApiError(401, "Invalid or expired access token");
  }
};

export const generateRefreshToken = (sub: string): string => {
  return jwt.sign({ sub }, config.REFRESH_SECRET, {
    algorithm: "HS256",
    expiresIn: "7d",
  });
};

export const verifyRefreshToken = (
  refreshToken: string,
): RefreshTokenPayload => {
  try {
    const decoded = jwt.verify(refreshToken, config.REFRESH_SECRET, {
      algorithms: ["HS256"],
    });

    if (
      decoded === null ||
      typeof decoded !== "object" ||
      typeof decoded.sub !== "string"
    ) {
      throw new ApiError(401, "Invalid refresh token");
    }

    return decoded as RefreshTokenPayload;
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }

    throw new ApiError(401, "Invalid or expired refresh token");
  }
};
