import PinoHttp from "pino-http";
import logger from "../config/logger.js";
export const requestLogger = PinoHttp.pinoHttp({
    logger,
    wrapSerializers: false,
    serializers: {
        req: (req) => ({
            id: req.id,
            method: req.method,
            url: req.url?.split("?")[0],
            remoteAccess: req.socket.remoteAccess,
            remotePort: req.socket.remotePort,
        }),
    },
});
