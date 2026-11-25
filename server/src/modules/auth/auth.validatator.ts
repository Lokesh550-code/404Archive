import * as z from "zod";

export const registerUserValidator = z.strictObject({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be at less than 20 characters long"),
  email: z.email().trim().toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password must be less than 128 characters long"),
});

export const verifyEmailValidator = z.strictObject({
  emailVerificationToken: z.string(),
});
