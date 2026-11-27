import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { config } from "./config/env.js";
import { requestLogger } from "./middlewares/requestLogger.middleware.js";

// Route and middleware imports
import healthRouter from "./modules/health/health.route.js";
import authRouter from "./modules/auth/auth.route.js";
import userRouter from "./modules/users/user.route.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { notFound } from "./middlewares/notFound.middleware.js";

const app = express();

app.use(requestLogger);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// cors configuration
app.use(
  cors({
    origin: config.CORS_ORIGIN?.split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Routes
app.use("/api/v1/health", healthRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

export default app;
