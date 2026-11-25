import { config } from "../../config/env.js";
import { userModel } from "../../models/user.model.js";
import { sendEmail } from "../../services/email.service.js";
import { hashPassword, verifyPassword } from "../../utils/password.js";
import { generateToken, hashToken } from "../../utils/token.js";
import { createVerificationEmail } from "../../templates/emails/verificationEmail.js";
import { ApiError } from "../../utils/ApiError.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";
export const registerUser = async (email, username, password) => {
    const passwordHash = await hashPassword(password);
    const emailVerificationToken = generateToken();
    const emailVerificationTokenHash = hashToken(emailVerificationToken);
    const verificationUrl = config.VERIFICATION_URL;
    let verificationEmailSent = true;
    const user = await userModel.create({
        username,
        email,
        passwordHash,
        role: "user",
        isEmailVerified: false,
        accountStatus: "active",
        emailVerificationTokenHash,
        emailVerificationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    try {
        await sendEmail(createVerificationEmail(user.email, verificationUrl, emailVerificationToken));
    }
    catch (err) {
        verificationEmailSent = false;
    }
    return {
        userId: user._id.toString(),
        email: user.email,
        username: user.username,
        verificationEmailSent,
    };
};
export const verifyEmail = async (emailVerificationToken) => {
    const hashedEmailVerificationToken = hashToken(emailVerificationToken);
    const user = await userModel
        .findOne({
        emailVerificationTokenHash: hashedEmailVerificationToken,
    })
        .select("+emailVerificationTokenHash +emailVerificationTokenExpiry");
    if (!user) {
        throw new ApiError(400, "Invalid email verification token");
    }
    if (user.isEmailVerified === true) {
        throw new ApiError(400, "Email already Verified");
    }
    if (!user.emailVerificationTokenExpiry) {
        throw new ApiError(500, "Email verification token expiry not found");
    }
    if (user.emailVerificationTokenExpiry <= new Date()) {
        throw new ApiError(400, "Email verification token expired");
    }
    user.isEmailVerified = true;
    user.emailVerificationTokenHash = undefined;
    user.emailVerificationTokenExpiry = undefined;
    const savedUser = await user.save();
    return {
        userId: savedUser._id.toString(),
        email: savedUser.email,
        isEmailVerified: savedUser.isEmailVerified,
    };
};
export const login = async (email, password) => {
    const user = await userModel.findOne({ email }).select("+passwordHash");
    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }
    const isPasswordCorrect = await verifyPassword(user.passwordHash, password);
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid email or password");
    }
    const now = new Date();
    let currentStatus = user.accountStatus;
    const suspensionExpiresAt = user.suspensionExpiresAt ?? null;
    if (currentStatus === "banned") {
        throw new ApiError(403, "Account is banned");
    }
    else if (currentStatus === "suspended" && suspensionExpiresAt === null) {
        throw new ApiError(403, "Suspension expiration time not found");
    }
    else if (currentStatus === "suspended" &&
        suspensionExpiresAt !== null &&
        suspensionExpiresAt > now) {
        throw new ApiError(403, "Account is suspended");
    }
    else if (currentStatus === "suspended" &&
        suspensionExpiresAt !== null &&
        suspensionExpiresAt <= now) {
        currentStatus = "active";
        user.suspensionExpiresAt = undefined;
    }
    const accessToken = generateAccessToken({
        sub: user._id.toString(),
        role: user.role,
    });
    const refreshToken = generateRefreshToken(user._id.toString());
    const refreshTokenHash = hashToken(refreshToken);
    user.accountStatus = currentStatus;
    user.refreshTokenHash = refreshTokenHash;
    user.refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await user.save();
    return {
        userId: user._id.toString(),
        email: user.email,
        username: user.username,
        accountStatus: user.accountStatus,
        refreshToken,
        accessToken,
    };
};
