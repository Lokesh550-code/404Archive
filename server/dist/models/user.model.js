import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Valid email is required",
        ],
    },
    passwordHash: {
        type: String,
        required: true,
        select: false,
    },
    role: {
        type: String,
        enum: ["user", "admin", "moderator"],
        default: "user",
        required: true,
    },
    avatarKey: {
        type: String,
        trim: true,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    emailVerificationTokenHash: {
        type: String,
        select: false,
    },
    emailVerificationTokenExpiry: {
        type: Date,
        select: false,
    },
    passwordResetTokenHash: {
        type: String,
        select: false,
    },
    passwordResetTokenExpiry: {
        type: Date,
        select: false,
    },
    refreshTokenHash: {
        type: String,
        select: false,
    },
    refreshTokenExpiry: {
        type: Date,
        select: false,
    },
    accountStatus: {
        type: String,
        trim: true,
        enum: ["active", "suspended", "banned"],
        default: "active",
    },
    suspensionExpiresAt: {
        type: Date,
        select: false,
    },
}, { timestamps: true });
export const userModel = mongoose.model("User", userSchema);
