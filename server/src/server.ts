import app from "./app.js";
import { connectDB } from "./config/db.js";
import { config } from "./config/env.js";

const PORT = config.PORT;
const DB_URI = config.DB_URI;

await connectDB(DB_URI);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
