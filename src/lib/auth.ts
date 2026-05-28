import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "./db";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [nextCookies()],
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
  },
  socialProviders: {
    google: {
      clientId: process.env.AUTH_GOOGLE_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
    },
  },
});
