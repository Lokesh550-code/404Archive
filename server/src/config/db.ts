import mongoose from "mongoose";

export const connectDB = async (MONGODB_URI: string) => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Conneted to DB");
  } catch (error) {
    console.log("Error: ", error);
    process.exit(1);
  }
};
