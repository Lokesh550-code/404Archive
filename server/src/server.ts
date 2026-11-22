import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 3000;
const DB_URI = process.env.MONGODB_URI || "mongodb:////localhost:27017";

await connectDB(DB_URI);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
