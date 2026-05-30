import { prisma } from "./db";

const BANNED_WORDS: string[] = [
  "sex",
  "porn",
  "xxx",
  "fuck",
  "shit",
  "bitch",
  "asshole",
  "bastard",
  "dick",
  "cock",
  "cunt",
  "whore",
  "slut",
  "nigger",
  "faggot",
  "spic",
  "kike",
  "chink",
  "gook",
  "terrorist",
  " suicide ",
  "kill yourself",
  "kys",
  "die",
  "murder",
  "child porn",
  "cp",
  "دعارة",
  "جنس",
  "سكس",
  "نيك",
  "شرموطة",
  "قحبة",
  "عرص",
  "خول",
  "متناك",
  "كسم",
  "كس",
  "زب",
  "طيز",
  "لحس",
  "مص",
  "لوطي",
  "سحاق",
  "مني",
  "بظر",
  "اير",
  "انتحار",
  "اقتل",
  "موت",
  "حرامي",
  "كذاب",
  "منافق",
  "جهنم",
  "كفر",
  "الحق",
  "خنزير",
  "كلب",
  "حمار",
];

export function checkContent(text: string): { flagged: boolean; matches: string[] } {
  const lower = text.toLowerCase();
  const matches = BANNED_WORDS.filter((word) => lower.includes(word));
  return { flagged: matches.length > 0, matches };
}

export async function notifyAdmins(type: string, title: string, message: string, link: string) {
  const admins = await prisma.user.findMany({
    where: { OR: [{ role: "admin" }, { role: "founder" }] },
    select: { id: true },
  });

  await prisma.notification.createMany({
    data: admins.map((admin) => ({
      id: crypto.randomUUID(),
      userId: admin.id,
      type,
      title,
      message,
      link,
    })),
  });
}
