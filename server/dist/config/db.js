import mongoose from "mongoose";
export const connectDB = async (MONGODB_URI) => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to DB");
    }
    catch (error) {
        console.log("Error: ", error);
        process.exit(1);
    }
};
export const disconnectDB = async () => {
    await mongoose.disconnect();
};
