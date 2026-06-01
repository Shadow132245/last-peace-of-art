import "dotenv/config";
// @ts-ignore
import { PrismaClient } from "../src/generated/prisma/client.ts";

const p = new PrismaClient();
try {
  const users = await p.user.findMany({ select: { id: true, role: true, roles: true } });
  const updates = users
    .filter((u) => !u.roles || u.roles.length === 0)
    .map((u) => p.user.update({ where: { id: u.id }, data: { roles: [u.role] } }));
  const r = await Promise.all(updates);
  console.log("Updated", r.length, "users");
  
  const withRoles = users.filter((u) => u.roles && u.roles.length > 0).length;
  const withoutRoles = users.filter((u) => !u.roles || u.roles.length === 0).length;
  console.log("Total users:", users.length, "| With roles:", withRoles, "| Without roles:", withoutRoles);
} catch (e) {
  console.error(e);
} finally {
  await p.$disconnect();
}
