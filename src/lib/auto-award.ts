import { prisma } from "./db";
import { logger } from "./logger";

export async function checkAndAwardBadges(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, points: true, createdAt: true, roles: true, role: true },
  });
  if (!user) return;

  const postsCount = await prisma.post.count({ where: { userId, published: true } });
  const commentsCount = await prisma.comment.count({ where: { userId } });

  const likesOnContent = await prisma.like.count({ where: { userId, entityType: { in: ["post", "project", "thread"] } } });
  const likesOnComments = await prisma.like.count({ where: { userId, entityType: "comment" } });

  const hasProfile = await prisma.profile.findUnique({ where: { userId }, select: { id: true } });

  const daysOld = Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24));
  const bugReportsCount = await prisma.ticket.count({ where: { userId, status: "resolved" } });

  const conditions: { badgeId: string; met: boolean }[] = [
    { badgeId: "content-king", met: postsCount >= 10 },
    { badgeId: "popular", met: likesOnContent >= 500 },
    { badgeId: "top-commenter", met: commentsCount >= 100 },
    { badgeId: "helper", met: likesOnComments >= 50 },
    { badgeId: "veteran", met: daysOld >= 365 },
    { badgeId: "rising-star", met: !!hasProfile },
    { badgeId: "elite", met: user.points >= 5000 },
    { badgeId: "bug-hunter", met: bugReportsCount >= 3 },
  ];

  const existingBadges = await prisma.userBadge.findMany({
    where: { userId },
    select: { badgeId: true },
  });
  const ownedBadgeIds = new Set(existingBadges.map((b) => b.badgeId));

  for (const { badgeId, met } of conditions) {
    if (met && !ownedBadgeIds.has(badgeId)) {
      const count = await prisma.userBadge.count({ where: { userId } });
      await prisma.userBadge.create({
        data: { id: crypto.randomUUID(), userId, badgeId, order: count },
      });

      const badge = await prisma.badge.findUnique({ where: { id: badgeId }, select: { name: true } });
      await prisma.notification.create({
        data: {
          id: crypto.randomUUID(),
          userId,
          type: "badge",
          title: "New Badge Earned!",
          message: badge ? `You earned the "${badge.name}" badge!` : "You earned a new badge!",
          link: "/badges",
        },
      });

      logger.info({ userId, badgeId }, `Badge auto-awarded to user ${userId}`);
    }
  }

  const currRoles: string[] = (user.roles ?? []) as string[];
  let newRoles = [...currRoles];
  let roleChanged = false;
  let newRoleName = "";

  if (bugReportsCount >= 3 && !currRoles.includes("bug_hunter")) {
    newRoles.push("bug_hunter");
    roleChanged = true;
    newRoleName = "bug_hunter";
  }

  if (roleChanged) {
    const roleOrder = ["user", "bug_hunter", "premium", "moderator", "admin", "founder"];
    const highest = roleOrder.filter((r) => newRoles.includes(r)).pop() ?? "user";

    await prisma.user.update({
      where: { id: userId },
      data: { roles: newRoles, role: highest },
    });

    const roleLabel = newRoleName === "bug_hunter" ? "Bug Hunter" : newRoleName;
    await prisma.notification.create({
      data: {
        id: crypto.randomUUID(),
        userId,
        type: "role",
        title: "New Role Earned!",
        message: `You have been awarded the "${roleLabel}" role!`,
        link: "/dashboard",
      },
    });

    logger.info({ userId, roles: newRoles }, `Roles auto-awarded to user ${userId}`);
  }
}
