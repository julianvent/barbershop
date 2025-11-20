import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { setEmailTransport, sendEmail } from "../../services/integrations/email.client.js"; 

dotenv.config();

async function main() {
  try {

    const testAccount = await nodemailer.createTestAccount();

    console.log("Credentials obtained, configuring Ethereal transporter...");

    const testTransporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    setEmailTransport(testTransporter);

    const info = await sendEmail({
      to: "cliente@example.com",
      subject: "Test Email (Notification Flow)",
      body: "Este es un correo de prueba usando email.client.js + Mailgen.",
    });

    console.log("✅ Message sent:", info.messageId);
    console.log("🔍 Preview URL:", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("❌ Error sending test email:", error);
  }
}

main();
