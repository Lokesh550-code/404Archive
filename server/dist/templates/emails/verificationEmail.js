export const createVerificationEmail = (email, verificationUrl, emailVerificationToken) => {
    return {
        to: email,
        subject: "Email verification | 404 Archive",
        html: `<!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Verify your email</title>
            </head>
            
            <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: Arial, sans-serif; color: #18181b;">
              <div style="max-width: 560px; margin: 40px auto; padding: 32px; background-color: #ffffff; border-radius: 8px;">
            
                <h1 style="font-size: 24px; margin-bottom: 24px;">
                  Welcome to 404 Archive.
                </h1>
            
                <p style="font-size: 15px; line-height: 1.6;">
                  Thanks for signing up! Before you start exploring, we need to verify your email address.
                </p>
            
                <p style="font-size: 15px; line-height: 1.6;">
                  Click the button below to verify your account.
                </p>
            
                <div style="margin: 32px 0;">
                  <a
                    href="${verificationUrl}/${emailVerificationToken}"
                    style="display: inline-block; padding: 12px 24px; background-color: #18181b; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: bold;"
                  >
                    Verify Email Address
                  </a>
                </div>
            
                <p style="font-size: 14px; line-height: 1.6; color: #52525b;">
                  This verification link expires in 24 hours.
                </p>
            
                <p style="font-size: 14px; line-height: 1.6; color: #52525b;">
                  If the button doesn't work, copy and paste this URL into your browser:
                  <br />
                  <a href="${verificationUrl}/${emailVerificationToken}" style="color: #2563eb; word-break: break-all;">
                    ${verificationUrl}/${emailVerificationToken}
                  </a>
                </p>
            
                <p style="font-size: 14px; line-height: 1.6; color: #52525b; margin-top: 32px;">
                  If you didn't create an account, you can safely ignore this email.
                </p>
            
                <hr style="border: 0; border-top: 1px solid #e4e4e7; margin: 32px 0;" />
            
                <p style="font-size: 12px; color: #71717a; text-align: center;">
                  404 Archive · A collection of interesting corners of the internet.
                </p>
              </div>
            </body>
          </html>`,
        text: `Welcome to 404 Archive!

    Thanks for signing up! Before you start exploring, we need to verify your email address.

    Visit the link below to verify your account:

    ${verificationUrl}/${emailVerificationToken}

    This verification link expires in 24 hours.

    If you didn't create an account, you can safely ignore this email.

    404 Archive
    A collection of interesting corners of the internet.`,
    };
};
