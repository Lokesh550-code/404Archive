import * as z from "zod";
import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";

export const validate = (
  schema: z.ZodType,
  source: "body" | "params" | "query" = "body",
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join(", "),
        message: issue.message,
      }));

      return next(new ApiError(400, "Validation failed", errors));
    }
    
    res.locals.validatedData = result.data;
    next();
  };
};
