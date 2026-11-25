import { config } from "../../config/env.js";
import { userModel } from "../../models/user.model.js";
import { sendEmail } from "../../services/email.service.js";
import { hashPassword } from "../../utils/password.js";
import { generateToken, hashToken } from "../../utils/token.js";
import { createVerificationEmail } from "../../templates/emails/verificationEmail.js";
import { ApiError } from "../../utils/ApiError.js";

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
