import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

const p = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

try {
  const users = await p.user.findMany({ select: { id: true, role: true, roles: true } });
  const updates = users
    .filter((u) => !u.roles || u.roles.length === 0)
    .map((u) => p.user.update({ where: { id: u.id }, data: { roles: [u.role] } }));
  const r = await Promise.all(updates);
  console.log("Updated", r.length, "users");
  await p.$disconnect();
} catch (e) {
  console.error(e);
  await p.$disconnect();
  process.exit(1);
}
