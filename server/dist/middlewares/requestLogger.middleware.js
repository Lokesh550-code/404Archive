import PinoHttp from "pino-http";
import logger from "../config/logger.js";
export const requestLogger = PinoHttp.pinoHttp({
    logger,
});
