import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// cors configuration
app.use(
  cors({
    origin:
      process.env.CORS_ORIGIN?.split(",")
        .map((origin) => origin.trim())
        .filter(Boolean) || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Route imports
import healthRouter from "./modules/health/health.route.js";
import { errorHandler } from "./middlewares/error.middleware.js";

// Routes
app.use("/api/v1/health", healthRouter);

// Error handling middleware
app.use(errorHandler);

export default app;
