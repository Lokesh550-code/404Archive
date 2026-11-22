import type {
  Response,
  Request,
  NextFunction,
  ErrorRequestHandler,
} from "express";
import { ApiError } from "../utils/ApiError.js";

export const errorHandler: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode: number = 500;
  let message: string = "Internal server error";
  let errors: unknown[] = [];

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  }

  res.status(statusCode).json({
    statusCode: statusCode,
    success: false,
    message: message,
    errors: errors,
  });
};
