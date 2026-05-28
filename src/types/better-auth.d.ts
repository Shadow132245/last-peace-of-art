import "better-auth";

declare module "better-auth" {
  interface User {
    role: string;
    banned: boolean;
    banReason: string | null;
    banExpires: Date | null;
  }
}
