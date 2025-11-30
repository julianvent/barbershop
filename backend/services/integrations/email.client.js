import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

let transporter = null;

/**
 * Create a nodemailer transporter based on the email provider.
 * For now, the default is Gmail; iCloud/SMTP could be implemented in the future.
 */
function createTransportForProvider(provider) {
  const normalized = (provider || "gmail").toLowerCase();

  switch (normalized) {
    case "gmail":
    default:
      try {
        const mailer = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.SMTP_USER || "sagozbarberdev@gmail.com",
            pass: process.env.SMTP_PASS || "bro-look-up-for-the-password",
          },
        });
        return mailer;
      } catch (error) {
        console.error("Error creating email transport: \n", error);
        throw error;
      }
  }
}

export function initEmailTransport() {
  if (transporter) return transporter;

  const provider = process.env.EMAIL_PROVIDER || "gmail";
  transporter = createTransportForProvider(provider);

  return transporter;
}

export function setEmailTransport(customTransporter) {
  transporter = customTransporter;
}

/**
 * @param {{to:string, subject:string, html?:string, text?:string}} params
 */
export async function sendEmail({ to, subject, html, text }) {
  if (!transporter) {
    initEmailTransport();
  }

  const fromAddress = process.env.SMTP_USER || "sagozbarberdev@gmail.com";

  const message = {
    from: fromAddress,
    to,
    subject,
  };

  if (html) {
    message.html = html;
  }

  if (text) {
    message.text = text;
  }

  const mail = await transporter.sendMail(message);

  if ((process.env.NODE_ENV || "development") !== "production") {
    console.log(`[email] Sent to ${to}`);
    const previewUrl = nodemailer.getTestMessageUrl(mail);
    if (previewUrl) {
      console.log("[email] Preview URL:", previewUrl);
    }
  }

  return mail;
}
