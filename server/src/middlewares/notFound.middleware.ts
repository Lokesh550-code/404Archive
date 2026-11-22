import type { RequestHandler, Response, Request } from "express";
import { ApiResponse } from "../utils/ApiResponse.js";

export const notFound: RequestHandler = (req: Request, res: Response) => {
  res.status(404).json(
    new ApiResponse(404, `Requested url not available`, {
      requestedUrl: req.originalUrl,
    }),
  );
};
