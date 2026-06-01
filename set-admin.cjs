const { PrismaClient } = require("./src/generated/prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

async function main() {
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });

  const user = await prisma.user.update({
    where: { email: "fghfghffdgfhfgh@gmail.com" },
    data: { role: "admin", roles: ["user", "admin"] },
  });

  console.log("User updated: " + user.name + " -> " + user.role);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
