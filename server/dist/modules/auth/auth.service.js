import { config } from "../../config/env.js";
import { userModel } from "../../models/user.model.js";
import { sendEmail } from "../../services/email.service.js";
import { hashPassword } from "../../utils/password.js";
import { generateToken, hashToken } from "../../utils/token.js";
import { createVerificationEmail } from "../../templates/emails/verificationEmail.js";
export const registerUser = async (email, username, password) => {
    const passwordHash = await hashPassword(password);
    const emailVerificationToken = generateToken();
    const emailVerificationTokenHash = hashToken(emailVerificationToken);
    const verificationUrl = config.VERIFICATION_URL;
    let verificationEmailSent = false;
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
        verificationEmailSent = true;
    }
    catch (err) { }
    return {
        userId: user._id.toString(),
        email: user.email,
        username: user.username,
        verificationEmailSent,
    };
};
