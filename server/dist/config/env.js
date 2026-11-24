import "dotenv/config";
let PORTSTRING = process.env.PORT;
let PORT;
let CORS_ORIGIN = process.env.CORS_ORIGIN;
const NODE_ENV = process.env.NODE_ENV;
const DB_URI = process.env.MONGODB_URI;
const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
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
if (!NODE_ENV ||
    (NODE_ENV && !["development", "test", "production"].includes(NODE_ENV))) {
    throw new Error("Invalid node environment");
}
if (!DB_URI) {
    throw new Error("DB URL is required");
}
if (!ACCESS_SECRET) {
    throw new Error("Access SECRET is requied");
}
if (!REFRESH_SECRET) {
    throw new Error("REFRESH SECRET is requied");
}
export const config = {
    PORT,
    CORS_ORIGIN,
    NODE_ENV,
    DB_URI,
    ACCESS_SECRET,
    REFRESH_SECRET,
};
