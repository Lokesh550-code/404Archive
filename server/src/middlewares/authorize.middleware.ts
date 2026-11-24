import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";
import { AuthenticatedUser } from "../types/authenticatedUser.js";

type UserRole = AuthenticatedUser["role"];

export const authorize = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthenticated");
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, "Insufficient permissions");
    }

    next();
  };
};
