import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { twoFactor } from "better-auth/plugins";
import { prisma } from "./db";
import { sendEmail } from "./email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    nextCookies(),
    twoFactor({
      allowPasswordless: true,
      otpOptions: {
        async sendOTP({ user, otp }) {
          await sendEmail({
            to: user.email,
            subject: "Your verification code — Last Peace of Art",
            html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 20px">
<tr><td align="center">
<table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
<tr><td style="background:linear-gradient(135deg,#18181b,#27272a);padding:32px 40px;text-align:center">
<h1 style="margin:0;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.3px">Last Peace of Art</h1>
<p style="margin:6px 0 0;font-size:13px;color:#a1a1aa">Your creative space</p>
</td></tr>
<tr><td style="padding:36px 40px 28px">
<h2 style="margin:0 0 8px;font-size:18px;font-weight:600;color:#18181b">Verification code</h2>
<p style="margin:0 0 20px;font-size:14px;color:#52525b;line-height:1.5">Use the code below to complete your sign-in. This code expires in 5 minutes.</p>
<div style="background:#f4f4f5;border-radius:8px;padding:20px;text-align:center;margin-bottom:20px">
<span style="font-size:32px;font-weight:700;letter-spacing:8px;color:#18181b;font-family:monospace">${otp}</span>
</div>
<p style="margin:0;font-size:13px;color:#71717a">If you didn't request this code, you can safely ignore this email.</p>
</td></tr>
<tr><td style="padding:0 40px 28px;border-top:1px solid #e4e4e7">
<p style="margin:16px 0 0;font-size:12px;color:#a1a1aa;text-align:center">Last Peace of Art — All rights reserved.</p>
</td></tr>
</table>
</td></tr></table>
</body>
</html>`,
          });
        },
      },
    }),
  ],
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "user",
        input: false,
      },
      banned: {
        type: "boolean",
        required: true,
        defaultValue: false,
        input: false,
      },
      banReason: {
        type: "string",
        input: false,
      },
      banExpires: {
        type: "date",
        input: false,
      },
      suspended: {
        type: "boolean",
        required: true,
        defaultValue: false,
        input: false,
      },
      suspensionReason: {
        type: "string",
        input: false,
      },
      suspendedUntil: {
        type: "date",
        input: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    async sendResetPassword({ user, url }) {
      await sendEmail({
        to: user.email,
        subject: "Reset your password — Last Peace of Art",
        html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 20px">
<tr><td align="center">
<table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
<tr><td style="background:linear-gradient(135deg,#18181b,#27272a);padding:32px 40px;text-align:center">
<h1 style="margin:0;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.3px">Last Peace of Art</h1>
<p style="margin:6px 0 0;font-size:13px;color:#a1a1aa">Your creative space</p>
</td></tr>
<tr><td style="padding:36px 40px 28px">
<h2 style="margin:0 0 8px;font-size:18px;font-weight:600;color:#18181b">Reset your password</h2>
<p style="margin:0 0 24px;font-size:14px;color:#52525b;line-height:1.5">You requested a password reset. Click the button below to set a new password. This link expires in 1 hour.</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto">
<tr><td style="background-color:#18181b;border-radius:8px;padding:0">
<a href="${url}" style="display:inline-block;padding:13px 32px;font-size:14px;font-weight:600;color:#ffffff;background-color:#18181b;border-radius:8px;text-decoration:none">Reset Password</a>
</td></tr>
</table>
<p style="margin:24px 0 0;font-size:13px;color:#71717a">If you didn't request this, you can safely ignore this email.</p>
<p style="margin:4px 0 0;font-size:12px;color:#a1a1aa;word-break:break-all">${url}</p>
</td></tr>
<tr><td style="padding:0 40px 28px;border-top:1px solid #e4e4e7">
<p style="margin:16px 0 0;font-size:12px;color:#a1a1aa;text-align:center">Last Peace of Art — All rights reserved.</p>
</td></tr>
</table>
</td></tr></table>
</body>
</html>`,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: false,
    async sendVerificationEmail({ user, url }) {
      await sendEmail({
        to: user.email,
        subject: "Verify your email — Last Peace of Art",
        html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 20px">
<tr><td align="center">
<table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
<tr><td style="background:linear-gradient(135deg,#18181b,#27272a);padding:32px 40px;text-align:center">
<h1 style="margin:0;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.3px">Last Peace of Art</h1>
<p style="margin:6px 0 0;font-size:13px;color:#a1a1aa">Your creative space</p>
</td></tr>
<tr><td style="padding:36px 40px 28px">
<h2 style="margin:0 0 8px;font-size:18px;font-weight:600;color:#18181b">Verify your email address</h2>
<p style="margin:0 0 24px;font-size:14px;color:#52525b;line-height:1.5">Thanks for joining Last Peace of Art! Click the button below to verify your email and activate your account.</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto">
<tr><td style="background-color:#18181b;border-radius:8px;padding:0">
<a href="${url}" style="display:inline-block;padding:13px 32px;font-size:14px;font-weight:600;color:#ffffff;background-color:#18181b;border-radius:8px;text-decoration:none">Verify Email</a>
</td></tr>
</table>
<p style="margin:24px 0 0;font-size:13px;color:#71717a">If the button doesn't work, copy and paste this link into your browser:</p>
<p style="margin:4px 0 0;font-size:12px;color:#a1a1aa;word-break:break-all">${url}</p>
</td></tr>
<tr><td style="padding:0 40px 28px;border-top:1px solid #e4e4e7">
<p style="margin:16px 0 0;font-size:12px;color:#a1a1aa;text-align:center">Last Peace of Art — All rights reserved.</p>
</td></tr>
</table>
</td></tr></table>
</body>
</html>`,
      });
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },
  socialProviders: {
    google: {
      clientId: process.env.AUTH_GOOGLE_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
    },
  },
});
