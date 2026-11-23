import mongoose from "mongoose";
import logger from "./logger.js";

export const connectDB = async (MONGODB_URI: string) => {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info("Connected to DB");
  } catch (err) {
    logger.fatal({ err }, "DataBase connection failed");
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  logger.info("Disconnected from DataBase");
};
