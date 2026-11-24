import { Resend } from "resend";
import { ApiError } from "../utils/ApiError.js";
import logger from "../config/logger.js";
import type { SendEmailOptions } from "../types/sendEmailOptions.js";
import { config } from "../config/env.js";

const resend = new Resend(config.RESEND_API_KEY);

export const sendEmail = async (emailOptions: SendEmailOptions) => {
  const sender = config.EMAIL_FROM;
  try {
    const { data, error } = await resend.emails.send({
      from: sender,
      to: emailOptions.to,
      subject: emailOptions.subject,
      html: emailOptions.html,
      text: emailOptions.text,
    });
    if (error) {
      logger.error({ err: error }, "Email delivery failed");
      throw new ApiError(503, "Email service unavailable");
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    logger.error({ err: error }, "Email delivery failed");
    throw new ApiError(503, "Email service unavailable");
  }
};
