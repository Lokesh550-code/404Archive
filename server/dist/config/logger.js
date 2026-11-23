import pino from "pino";
import { config } from "./env.js";
const isDevelopment = config.NODE_ENV === "development";
const logger = pino({
    level: isDevelopment ? "debug" : "info",
    ...(isDevelopment
        ? {
            transport: {
                target: "pino-pretty",
            },
        }
        : {}),
    redact: {
        paths: [
            "req.headers.authorization",
            "req.headers.cookie",
            "req.headers.x-api-key",
            "res.headers.set-cookie",
            "password",
            "accessToken",
            "refreshToken",
        ],
        remove: true,
    },
});
export default logger;
