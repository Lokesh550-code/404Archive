import app from "./app.js";
import { connectDB, disconnectDB } from "./config/db.js";
import { config } from "./config/env.js";

const PORT = config.PORT;
const DB_URI = config.DB_URI;

await connectDB(DB_URI);

const server = app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

let isShuttingDown = false;
const shutdown = async () => {
  if (isShuttingDown) return;

  isShuttingDown = true;

  console.log("Graceful shutdown initiated");
  try {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });

    console.log("HTTP server closed");

    await disconnectDB();

    console.log("MongoDB disconnected");
  } catch (error) {
    console.error("Error during shutdown: ", error);
    process.exitCode = 1;
  }
};

process.on("SIGINT", () => {
  shutdown();
});

process.on("SIGTERM", () => {
  shutdown();
});
