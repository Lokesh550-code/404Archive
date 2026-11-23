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
});
export default logger;
