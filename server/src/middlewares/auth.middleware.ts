import type { Response, Request, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { accessToken } = req.cookies ?? {};

    if (!accessToken) {
      throw new ApiError(401, "Missing access token");
    }

    const decodedTokenPayload = verifyAccessToken(accessToken);

    req.user = decodedTokenPayload;
    next();
  } catch (error) {
    next(error);
  }
};
