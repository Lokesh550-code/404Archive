import "dotenv/config";
let PORTSTRING = process.env.PORT;
let PORT;
let CORS_ORIGIN = process.env.CORS_ORIGIN;
const NODE_ENV = process.env.NODE_ENV;
const DB_URI = process.env.MONGODB_URI;
const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM;
const VERIFICATION_URL = process.env.VERIFICATION_URL;
const RESET_URL = process.env.RESET_URL;
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
if (!RESEND_API_KEY) {
    throw new Error("Resend Api key is requied");
}
if (!EMAIL_FROM) {
    throw new Error("Sender email is required");
}
if (!VERIFICATION_URL) {
    throw new Error("Verification url is required");
}
if (!RESET_URL) {
    throw new Error("Rest url is required");
}
export const config = {
    PORT,
    CORS_ORIGIN,
    NODE_ENV,
    DB_URI,
    ACCESS_SECRET,
    REFRESH_SECRET,
    RESEND_API_KEY,
    EMAIL_FROM,
    VERIFICATION_URL,
    RESET_URL,
};
