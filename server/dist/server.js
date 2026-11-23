import app from "./app.js";
import { connectDB, disconnectDB } from "./config/db.js";
import { config } from "./config/env.js";
import logger from "./config/logger.js";
const PORT = config.PORT;
const DB_URI = config.DB_URI;
await connectDB(DB_URI);
const server = app.listen(PORT, () => {
    logger.info(`Server running on port: ${PORT}`);
});
let isShuttingDown = false;
const shutdown = async () => {
    if (isShuttingDown)
        return;
    isShuttingDown = true;
    logger.info("Graceful shutdown initiated");
    const timeout = setTimeout(() => {
        logger.warn("Shutdown timeout reached. Closing connections forcefully");
        server.closeAllConnections();
    }, 10000);
    timeout.unref();
    try {
        await new Promise((resolve, reject) => {
            server.close((error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
        logger.info("HTTP server closed");
        await disconnectDB();
        process.exitCode = 0;
        logger.info("MongoDB disconnected");
    }
    catch (err) {
        logger.error({ err }, "Error during shutdown");
        process.exitCode = 1;
    }
    finally {
        clearTimeout(timeout);
    }
};
process.on("SIGINT", () => {
    shutdown();
});
process.on("SIGTERM", () => {
    shutdown();
});
