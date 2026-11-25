import { config } from "./env.js";
export const baseCookieOptions = {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "strict",
};
export const accessTokenCookieOptions = {
    ...baseCookieOptions,
    maxAge: 15 * 60 * 1000,
};
export const refreshTokenCookieOptions = {
    ...baseCookieOptions,
    path: "/api/v1/auth/refresh",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};
