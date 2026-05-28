import { PrismaClient } from "./src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const user = await prisma.user.update({
  where: { email: "fghfghffdgfhfgh@gmail.com" },
  data: { role: "admin" },
});

console.log("User updated:", user.name, "->", user.role);
await prisma.$disconnect();
