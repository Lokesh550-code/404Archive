import { userModel } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
export const accountStatusCheck = asyncHandler(async (req, res, next) => {
    const userId = req.user?.sub;
    const now = new Date();
    if (!userId) {
        throw new ApiError(401, "Unauthenticated");
    }
    const user = await userModel
        .findById(userId)
        .select("+suspensionExpiresAt");
    if (!user) {
        throw new ApiError(401, "User not found");
    }
    const currentRole = user.role;
    let currentStatus = user.accountStatus;
    const suspensionExpiresAt = user.suspensionExpiresAt ?? null;
    if (currentStatus === "banned") {
        throw new ApiError(403, "Account is banned");
    }
    else if (currentStatus === "suspended" &&
        suspensionExpiresAt === null) {
        throw new ApiError(403, "Suspension expiration time not found");
    }
    else if (currentStatus === "suspended" &&
        suspensionExpiresAt !== null &&
        suspensionExpiresAt > now) {
        throw new ApiError(403, "Account is suspended");
    }
    else if (currentStatus === "suspended" &&
        suspensionExpiresAt !== null &&
        suspensionExpiresAt <= now) {
        currentStatus = "active";
    }
    req.user = {
        sub: userId,
        role: currentRole,
        accountStatus: currentStatus,
    };
    next();
});
