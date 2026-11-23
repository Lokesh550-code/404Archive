import type { Response, Request, NextFunction, RequestHandler } from "express";
import logger from "../config/logger.js";

export const asyncHandler = (fn: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      logger.error({ err: error });
      next(error);
    });
  };
};
