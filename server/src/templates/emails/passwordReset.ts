import { SendEmailOptions } from "../../types/sendEmailOptions.js";

export const createPasswordResetEmail = (
  email: string,
  passwordResetUrl: string,
  passwordResetToken: string,
): SendEmailOptions => {
  return {
    to: email,
    subject: "Password reset | 404 Archive",
    html: `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Reset your password</title>
          </head>

          <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: Arial, sans-serif; color: #18181b;">
            <div style="max-width: 560px; margin: 40px auto; padding: 32px; background-color: #ffffff; border-radius: 8px;">

              <h1 style="font-size: 24px; margin-bottom: 24px;">
                Password reset requested.
              </h1>

              <p style="font-size: 15px; line-height: 1.6;">
                We received a request to reset the password associated with your 404 Archive account.
              </p>

              <p style="font-size: 15px; line-height: 1.6;">
                Click the button below to choose a new password.
              </p>

              <div style="margin: 32px 0;">
                <a
                  href="${passwordResetUrl}/${passwordResetToken}"
                  style="display: inline-block; padding: 12px 24px; background-color: #18181b; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: bold;"
                >
                  Reset Password
                </a>
              </div>

              <p style="font-size: 14px; line-height: 1.6; color: #52525b;">
                This password reset link expires in 15 minutes.
              </p>

              <p style="font-size: 14px; line-height: 1.6; color: #52525b;">
                If the button doesn't work, copy and paste this URL into your browser:
                <br />
                <a href="${passwordResetUrl}/${passwordResetToken}" style="color: #2563eb; word-break: break-all;">
                  ${passwordResetUrl}/${passwordResetToken}
                </a>
              </p>

              <p style="font-size: 14px; line-height: 1.6; color: #52525b; margin-top: 32px;">
                If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
              </p>

              <hr style="border: 0; border-top: 1px solid #e4e4e7; margin: 32px 0;" />

              <p style="font-size: 12px; color: #71717a; text-align: center;">
                404 Archive · A collection of interesting corners of the internet.
              </p>
            </div>
          </body>
        </html>`,

    text: `Password reset requested.
           
           We received a request to reset the password associated with your 404 Archive account.
           
           Visit the link below to choose a new password:
           
           ${passwordResetUrl}/${passwordResetToken}
           
           This password reset link expires in 15 minutes.
           
           If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
           
           404 Archive
           A collection of interesting corners of the internet.`,
  };
};
