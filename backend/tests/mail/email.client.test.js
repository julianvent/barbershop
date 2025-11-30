import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import nodemailer from "nodemailer";
import { sendEmail, setEmailTransport } from "../../services/integrations/email.client.js";

// Mock nodemailer
vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn().mockReturnValue({
      sendMail: vi.fn().mockResolvedValue({ messageId: "test-id" }),
    }),
    createTestAccount: vi.fn().mockResolvedValue({
      user: "test-user",
      pass: "test-pass",
      smtp: { host: "smtp.ethereal.email", port: 587, secure: false },
    }),
    getTestMessageUrl: vi.fn(),
  },
}));

describe("Email Client", () => {
  let sendMailMock;

  beforeEach(() => {
    vi.clearAllMocks();
    // We will rely on setEmailTransport to inject our mock.

    sendMailMock = vi.fn().mockResolvedValue({ messageId: "mock-id" });
    const mockTransporter = {
      sendMail: sendMailMock,
    };
    setEmailTransport(mockTransporter);
  });

  it("should send an email using the configured transporter", async () => {
    const mailOptions = {
      to: "zs22017021@estudiantes.uv.mx",
      subject: "Test Subject",
      text: "Test Body",
    };

    const result = await sendEmail(mailOptions);

    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock).toHaveBeenCalledWith(expect.objectContaining({
      to: "zs22017021@estudiantes.uv.mx",
      subject: "Test Subject",
      text: "Test Body",
    }));
    expect(result).toEqual({ messageId: "mock-id" });
  });

  it("should support HTML content", async () => {
    const mailOptions = {
      to: "zs22017021@estudiantes.uv.mx",
      subject: "HTML Test",
      html: "<p>HTML Body</p>",
    };

    await sendEmail(mailOptions);

    expect(sendMailMock).toHaveBeenCalledWith(expect.objectContaining({
      html: "<p>HTML Body</p>",
    }));
  });

  it("should log preview URL in development", async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";
    const consoleSpy = vi.spyOn(console, "log");
    nodemailer.getTestMessageUrl.mockReturnValue("http://preview.url");

    await sendEmail({ to: "test@example.com", subject: "Dev Test" });

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Preview URL:"), "http://preview.url");

    process.env.NODE_ENV = originalEnv;
  });
});
