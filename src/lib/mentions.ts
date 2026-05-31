const MENTION_REGEX = /@(\w{3,30})/g;

export function extractMentions(text: string): string[] {
  const matches = text.match(MENTION_REGEX);
  if (!matches) return [];
  return [...new Set(matches.map((m) => m.slice(1)))];
}

export async function notifyMentioned(
  mentions: string[],
  actorName: string,
  link: string,
  prisma: any,
) {
  for (const username of mentions) {
    const user = await prisma.user.findUnique({ where: { name: username } });
    if (!user) continue;
    await prisma.notification.create({
      data: {
        id: crypto.randomUUID(),
        userId: user.id,
        type: "mention",
        title: `@${actorName} mentioned you`,
        message: `${actorName} mentioned you in a post`,
        link,
      },
    });
  }
}
