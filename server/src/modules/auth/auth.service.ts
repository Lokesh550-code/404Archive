import { config } from "../../config/env.js";
import { userModel } from "../../models/user.model.js";
import { sendEmail } from "../../services/email.service.js";
import { hashPassword, verifyPassword } from "../../utils/password.js";
import { generateToken, hashToken } from "../../utils/token.js";
import { createVerificationEmail } from "../../templates/emails/verificationEmail.js";
import { ApiError } from "../../utils/ApiError.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.js";
import { createPasswordResetEmail } from "../../templates/emails/passwordReset.js";

export const registerUser = async (
  email: string,
  username: string,
  password: string,
) => {
  const passwordHash = await hashPassword(password);

  const emailVerificationToken = generateToken();

  const emailVerificationTokenHash = hashToken(emailVerificationToken);

  const verificationUrl = config.VERIFICATION_URL;

  let verificationEmailSent: boolean = true;

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
    await sendEmail(
      createVerificationEmail(
        user.email,
        verificationUrl,
        emailVerificationToken,
      ),
    );
  } catch (err) {
    verificationEmailSent = false;
  }

  return {
    userId: user._id.toString(),
    email: user.email,
    username: user.username,
    verificationEmailSent,
  };
};

export const verifyEmail = async (emailVerificationToken: string) => {
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

export const login = async (email: string, password: string) => {
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
  } else if (currentStatus === "suspended" && suspensionExpiresAt === null) {
    throw new ApiError(403, "Suspension expiration time not found");
  } else if (
    currentStatus === "suspended" &&
    suspensionExpiresAt !== null &&
    suspensionExpiresAt > now
  ) {
    throw new ApiError(403, "Account is suspended");
  } else if (
    currentStatus === "suspended" &&
    suspensionExpiresAt !== null &&
    suspensionExpiresAt <= now
  ) {
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

export const logout = async (sub: string) => {
  const user = await userModel.findById(sub);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.refreshTokenHash = undefined;
  user.refreshTokenExpiry = undefined;

  await user.save();

  return;
};

export const refresh = async (refreshToken: string) => {
  const verifiedRefreshToken = verifyRefreshToken(refreshToken);

  const hashedRefreshToken = hashToken(refreshToken);

  const generatedRefreshToken = generateRefreshToken(verifiedRefreshToken.sub);
  const generatedRefreshTokenHash = hashToken(generatedRefreshToken);

  const user = await userModel.findOneAndUpdate(
    {
      _id: verifiedRefreshToken.sub,
      refreshTokenHash: hashedRefreshToken,
      refreshTokenExpiry: { $gt: new Date() },
      accountStatus: "active",
    },
    {
      $set: {
        refreshTokenHash: generatedRefreshTokenHash,
        refreshTokenExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    },
    { new: true },
  );

  if (!user) {
    throw new ApiError(400, "Invalid or expired refresh token");
  }

  const accessToken = generateAccessToken({
    sub: user._id.toString(),
    role: user.role,
  });

  return {
    accessToken,
    generatedRefreshToken,
  };
};

export const requestPasswordReset = async (email: string) => {
  const resetPasswordUrl = config.RESET_URL;

  const passwordResetToken = generateToken();
  const hashedPasswordResetToken = hashToken(passwordResetToken);
  const user = await userModel.findOneAndUpdate(
    { email },
    {
      $set: {
        passwordResetTokenHash: hashedPasswordResetToken,
        passwordResetTokenExpiry: new Date(Date.now() + 15 * 60 * 1000),
      },
    },
  );
  let resetEmailSent: boolean = false;
  if (!user) {
    resetEmailSent = true;
    return {
      resetEmailSent,
    };
  }

  try {
    await sendEmail(
      createPasswordResetEmail(email, resetPasswordUrl, passwordResetToken),
    );
    resetEmailSent = true;
  } catch (error) {
    resetEmailSent = false;
  }

  return {
    resetEmailSent,
  };
};

export const resetPassword = async (
  resetPasswordToken: string,
  newPassword: string,
) => {
  const hashedResetPasswordToken = hashToken(resetPasswordToken);
  const hashedPassword = await hashPassword(newPassword);

  const user = await userModel.findOneAndUpdate(
    {
      passwordResetTokenHash: hashedResetPasswordToken,
      passwordResetTokenExpiry: { $gt: new Date() },
    },
    {
      $set: {
        passwordHash: hashedPassword,
      },
      $unset: {
        passwordResetTokenExpiry: 1,
        passwordResetTokenHash: 1,
        refreshTokenHash: 1,
        refreshTokenExpiry: 1,
      },
    },
  );

  if (!user) {
    throw new ApiError(400, "Invalid password reset token");
  }
};
