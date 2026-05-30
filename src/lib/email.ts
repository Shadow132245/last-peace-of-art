import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const from = process.env.SMTP_FROM ?? "noreply@lastpeaceof.art";
  try {
    const info = await transporter.sendMail({ from, to, subject, html });
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
}
