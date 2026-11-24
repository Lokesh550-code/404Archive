import { config } from "../config/env.js";
import jwt from "jsonwebtoken";
import { ApiError } from "./ApiError.js";
export const generateAccessToken = (payload) => {
    return jwt.sign({ sub: payload.sub, role: payload.role }, config.ACCESS_SECRET, {
        algorithm: "HS256",
        expiresIn: "15m",
    });
};
export const verifyAccessToken = (accessToken) => {
    try {
        const decoded = jwt.verify(accessToken, config.ACCESS_SECRET, {
            algorithms: ["HS256"],
        });
        if (decoded === null ||
            typeof decoded !== "object" ||
            typeof decoded.sub !== "string" ||
            typeof decoded.role !== "string" ||
            !["user", "admin", "moderator"].includes(decoded.role)) {
            throw new ApiError(401, "Invalid access token");
        }
        return decoded;
    }
    catch (err) {
        if (err instanceof ApiError) {
            throw err;
        }
        throw new ApiError(401, "Invalid or expired access token");
    }
};
export const generateRefreshToken = (sub) => {
    return jwt.sign({ sub }, config.REFRESH_SECRET, {
        algorithm: "HS256",
        expiresIn: "7d",
    });
};
export const verifyRefreshToken = (refreshToken) => {
    try {
        const decoded = jwt.verify(refreshToken, config.REFRESH_SECRET, {
            algorithms: ["HS256"],
        });
        if (decoded === null ||
            typeof decoded !== "object" ||
            typeof decoded.sub !== "string") {
            throw new ApiError(401, "Invalid refresh token");
        }
        return decoded;
    }
    catch (err) {
        if (err instanceof ApiError) {
            throw err;
        }
        throw new ApiError(401, "Invalid or expired refresh token");
    }
};
