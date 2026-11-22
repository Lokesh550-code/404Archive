import "dotenv/config";

let PORTSTRING: number | string | undefined = process.env.PORT;
let PORT: number;
let CORS_ORIGIN = process.env.CORS_ORIGIN;
const NODE_ENV = process.env.NODE_ENV;
const DB_URI = process.env.MONGODB_URI;

if (!PORTSTRING) {
  throw new Error("Port is required");
}

PORT = Number(PORTSTRING);

if (Number.isNaN(PORT) || !Number.isInteger(PORT)) {
  throw new Error("Invalid port");
}

if (!(PORT >= 1 && PORT <= 65535)) {
  throw new Error("Invalid port");
}

if (!CORS_ORIGIN) {
  throw new Error("CORS is required");
}

if (
  !NODE_ENV ||
  (NODE_ENV && !["development", "test", "production"].includes(NODE_ENV))
) {
  throw new Error("Invalid node environment");
}

if (!DB_URI) {
  throw new Error("DB URL is required");
}
export const config = { PORT, CORS_ORIGIN, NODE_ENV, DB_URI };
