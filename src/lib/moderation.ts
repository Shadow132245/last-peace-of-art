import { prisma } from "./db";
import { checkWithAI } from "./openai-moderation";

// ─── English banned words (300+) ─────────────────────────────────────
const ENG_SEXUAL: string[] = [
  "sex", "porn", "porno", "xxx", "fuck", "fucking", "fucker", "fucked",
  "shit", "bitch", "asshole", "bastard", "dick", "cock", "cunt", "whore",
  "slut", "blowjob", "handjob", "rimjob", "bukkake", "gangbang",
  "motherfucker", "motherfucking", "dickhead", "dickhead",
  "cum", "cumshot", "semen", "ejaculate", "orgasm",
  "penis", "vagina", "clit", "clitoris", "labia", "vulva",
  "anal", "anilingus", "cunnilingus", "fellatio", "erection",
  "masturbate", "masturbation", "wank", "wanker", "jackoff", "jerkoff",
  "pussy", "pussies", "tits", "titties", "boobs", "breasts",
  "naked", "nude", "nudity", "stripper", "stripping",
  "prostitute", "prostitution", "escort", "hooker",
  "incest", "bestiality", "orgy", "threesome", "bdsm",
  "facial", "creampie", "milf", "squirting",
  "horny", "kinky", "fetish", "bdsm", "bondage",
  "rape", "raping", "rapist", "molest", "molestation", "pedophile", "pedophilia",
  "child porn", "child pornography", "cp", "lolita",
];

const ENG_PROFANITY: string[] = [
  "damn", "goddamn", "hell", "crap", "bullshit", "horseshit",
  "piss", "pissed", "pissing", "screw you", "screw that",
  "douche", "douchebag", "jackass", "dumbass", "dumbfuck",
  "son of a bitch", "sonofabitch",
  "arse", "arsehole", "bollocks", "bloody hell",
  "twat", "tit", "prat", "plonker", "wazzock",
  "bugger", "bugger off", "sod off",
  "crikey", "blimey",
];

const ENG_SLURS: string[] = [
  "nigger", "nigga", "niggah",
  "faggot", "fag", "faggotry",
  "spic", "spick", "wetback",
  "kike", "chink", "gook", "nip", "slant eye",
  "coon", "darkie",
  "raghead", "towelhead", "camel jockey",
  "paki", "pajeet",
  "gypo", "pikey",
  "redskin", "squaw",
  "tranny", "transexual", "she-male",
  "dyke", "lesbo", "queer",
  "retard", "retarded", "mongoloid", "spaz", "spastic",
  "midget", "cripple", "gimp",
  "white trash", "trailer trash",
  "beaner", "zip", "border hopper",
];

const ENG_VIOLENCE: string[] = [
  "kill yourself", "kys", "k y s", "kill urself",
  "suicide", "commit suicide",
  "murder", "murderer", "murdering",
  "die", "dying",
  "torture", "torturing",
  "behead", "beheading", "decapitate",
  "bomb", "bombing", "terrorist", "terrorism",
  "massacre", "mass shooting",
  "school shooting", "school shooter",
  "shoot up", "shootup",
  "stab", "stabbing",
  "hang", "hanging",
  "drown", "drowning",
  "burn alive", "burning alive",
  "execution", "execute",
  "genocide", "ethnic cleansing",
  "self harm", "selfharm", "self-harm",
  "cutting myself", "cut my wrist",
];

const ENG_DRUGS: string[] = [
  "cocaine", "crack", "heroin", "meth", "methamphetamine",
  "ecstasy", "mdma", "lsd", "acid", "mushrooms", "psychedelic",
  "weed", "marijuana", "cannabis", "pot", "hash", "hashish",
  "opium", "morphine", "fentanyl", "oxycodone", "xanax",
  "amphetamine", "speed", "crystal meth",
  "drug dealer", "drugs", "narcotics",
  "syringe", "needle", "inject",
  "overdose", "od",
];

const ENG_HATE: string[] = [
  "hate", "haters",
  "die in a fire", "go to hell", "burn in hell",
  "worthless", "useless", "stupid",
  "idiot", "moron", "imbecile", "dunce",
  "loser", "pathetic", "scum", "trash",
  "you should die", "nobody likes you", "nobody loves you",
  "go kill yourself", "go die", "kill yourself",
  "incel", "femcel",
  "simp", "cuck", "beta",
];

const ENG_SCAM: string[] = [
  "free money", "get rich quick", "make money fast",
  "click here", "act now", "limited offer",
  "bitcoin", "crypto", "investment opportunity",
  "work from home", "make money online",
  "fake", "scam", "fraud", "phishing",
  "password", "login details", "credit card",
  "bank transfer", "western union", "money gram",
  "verify your account", "confirm your details",
  "you won", "you are the winner", "congratulations you won",
];

// ─── Arabic banned words (200+) ──────────────────────────────────────
const AR_SEXUAL: string[] = [
  "جنس", "سكس", "سيكس", "نيك", "نياك", "منيك", "منيوكة",
  "كس", "كساس", "زب", "زبر", "زبوب",
  "بز", "بزاز", "صدر", "نهود",
  "طيز", "طياز", "مؤخرة",
  "شرج", "شرجي",
  "لحس", "مص", "مصاص",
  "دعارة", "عاهرة", "شرموطة", "قحبة", "قحب",
  "عرص", "عروص", "عيورة",
  "خول", "خولات",
  "متناك", "منيوك", "منيكة",
  "سحاق", "سحاقية", "مساحقة",
  "لوطي", "لواط", "مثلي",
  "بوية", "بوي",
  "اغتصاب", "مغتصب", "اغتصب",
  "تحرش", "متحرش", "تحرش جنسي",
  "استمناء", "عادة سرية",
  "قذف", "مني", "سائل منوي",
  "انتصاب", "قضيب", "مهبل", "بظر",
  "شهوة", "شهواني",
  "افلام اباحية", "افلام سكس", "موقع سكس",
  "نيك محارم", "سكس مع حيوان",
  "جنس اطفال", "تحرش اطفال", "بيدوفيليا",
  "ولد ومص", "بنت وتص",
  "سكس جماعي", "اورجي",
  "خلفي", "من الخلف", "وضعية",
  "مقاطع سكس", "صور سكس",
  "تعارف جنسي", "زواج عرفي", "متعة",
  "رومانسية", "عشيقة", "عشيق",
  "خيانة زوجية", "خيانة",
];

const AR_PROFANITY: string[] = [
  "شرموط", "قحب", "عاهرة",
  "كلب", "كلبة", "يا كلب",
  "حمار", "حمارة",
  "خنزير", "خنزيرة",
  "بهيمة", "حيوان",
  "تيس", "عنزة",
  "غبي", "غبية", "اغبياء", "تخلف",
  "جاهل", "متخلف", "معتوه",
  "مجنون", "مجنونة", "جننت",
  "انذال", "نذل", "نذلة",
  "حقير", "حقيرة", "حقران",
  "وسخ", "وسخة", "متوسخ",
  "قذر", "قذرة",
  "خسيس", "خسيسة",
  "وضيع", "وضيعة",
  "ابن كلب", "بنت كلب", "اولاد كلب",
  "ابن وسخ", "بنت وسخه",
  "يا حمار", "يا غبي", "يا متخلف",
  "تبا", "اللعنة", "لعنك", "لعن الله",
  "عيب", "عار", "فضيحة",
];

const AR_SLURS: string[] = [
  "عبد", "عبيد",
  "صعيدي", "صعايدة",
  "فلاح", "فلاحة",
  "بدوي", "بدو",
  "صعلوك", "صعاليك",
  "يهودي", "يهود",
  "كفار", "كافر", "كفرة", "ملحد",
  "مشرك", "مشركين",
  "رافضي", "روافض",
  "ناصبي", "نواصب",
  "وهابي", "وهابية",
  "اخوان", "اخوانجي",
  "دواعش", "داعشي",
  "ارهابي", "ارهابية",
  "عميل", "عملاء",
  "خائن", "خونة",
  "متخلف عقلي", "معاق",
  "اعرج", "اعمى", "اطرش", "ابكم",
  "غول", "شيطان", "عفريت",
  "زنجي", "اسود", "عبد",
  "هنود", "هندي",
  "صينيين", "صيني",
  "عرقي", "عنصري",
];

const AR_VIOLENCE: string[] = [
  "انتحار", "انتحر", "منتحر",
  "اقتل", "يقتل", "قتل", "قاتل", "قتلة", "قتلته",
  "اذبح", "يذبح", "ذبح", "دبح",
  "اضرب", "ضرب", "ضربي",
  "اكسر", "كسر", "تكسر",
  "احرق", "يحرق", "حرق", "حرقان",
  "فجر", "تفجير", "متفجرات",
  "سيف", "سكين", "مطواة", "سلاح",
  "دم", "دماء", "دمار",
  "تدمير", "هدم", "هدمت",
  "حرب", "حروب", "قتال", "معركة",
  "ألم", "عذاب", "عقاب",
  "سجن", "مسجون", "حبس",
  "اعدام", "اعدمه", "شنق",
  "ختان", "ختان الاناث",
  "عنف", "عنيف", "عنيفة",
  "ارهاب", "ارهابي",
  "تفجير نفسه", "انتحاري",
  "حزام ناسف", "عبوة ناسفة",
  "خطف", "مخطوف", "خطف طفل",
  "ضرب", "ضرب نار", "اطلاق نار",
  "طعن", "مطعون",
  "دهس", "دهس بالعربية",
];

const AR_RELIGIOUS: string[] = [
  "ربنا", "الله", "الإله",
  "الدين", "المذهب",
  "قرآن", "قرأن", "مصحف",
  "اسلام", "مسلم", "مسلمين",
  "مسيحي", "مسيحية", "نصراني",
  "يهودي", "يهودية",
  "كفر", "كافر", "كفار", "كفرة",
  "الحق", "الحمد لله",
  "سب", "سباب", "شتم",
  "دين", "ملحد", "الحاد",
  "كتاب مقدس", "انجيل", "توراة",
  "كنيسة", "مسجد", "معبد",
  "حجاب", "نقاب", "برقع",
  "ملتزم", "ملتزمة",
  "متطرف", "متطرفة", "تطرف",
  "جهاد", "جهادي", "مجاهد",
  "فتنة", "فتن",
  "بدعة", "بدع", "مبتدع",
  "ضلال", "ضال", "ضالة",
  "شرك", "مشرك",
  "نفاق", "منافق", "منافقة",
];

const AR_HARASSMENT: string[] = [
  "انتحر", "انتحري",
  "يا خول", "يا عرص",
  "حرامي", "حرامية", "حراميه",
  "كذاب", "كذابة", "كذابين",
  "منافق", "منافقة",
  "مخبول", "مخبولة",
  "مريض", "مريضة",
  "مش عجبك", "مش عاجبك", "عيب فيك",
  "تف عليك", "تفو",
  "يلعن", "ملعون", "لعنك",
  "انذل", "انذال",
  "انشف", "انشفه",
  "اسكت", "اخرس",
  "بطل", "بطلت",
  "فشل", "فاشل", "فاشلة",
  "حظك", "حظك وحش",
  "انت فاضي", "فاضي",
  "محروم", "محروومة",
  "نفسي", "نفسية",
];

// ─── Combine all ─────────────────────────────────────────────────────
const BANNED_WORDS: string[] = [
  ...ENG_SEXUAL, ...ENG_PROFANITY, ...ENG_SLURS,
  ...ENG_VIOLENCE, ...ENG_DRUGS, ...ENG_HATE, ...ENG_SCAM,
  ...AR_SEXUAL, ...AR_PROFANITY, ...AR_SLURS,
  ...AR_VIOLENCE, ...AR_RELIGIOUS, ...AR_HARASSMENT,
];

// ─── Normalize text to catch bypass attempts ────────────────────────
function normalizeText(text: string): string {
  let normalized = text.toLowerCase();

  // Remove diacritics (Arabic tashkeel, English accents)
  normalized = normalized.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Leetspeak / character substitutions
  const subs: Record<string, string> = {
    "0": "o", "1": "i", "2": "z", "3": "e", "4": "a",
    "5": "s", "6": "g", "7": "t", "8": "b", "9": "g",
    "@": "a", "$": "s", "!": "i", "+": "t",
    "#": "h", "%": "x",
  };
  normalized = normalized.split("").map((c) => subs[c] ?? c).join("");

  // Remove common separators between characters (dots, dashes, underscores, spaces, etc.)
  normalized = normalized.replace(/[.\-*_|]+/g, "");

  // Collapse repeated characters (3+ → 2, e.g. "fuuuuck" → "fuuck")
  normalized = normalized.replace(/(.)\1{2,}/g, "$1$1");

  return normalized;
}

// ─── Main check ─────────────────────────────────────────────────────
export async function checkContent(text: string): Promise<{
  flagged: boolean;
  matches: string[];
  aiFlagged?: boolean;
  aiCategories?: string[];
}> {
  const lower = text.toLowerCase();
  const normalized = normalizeText(text);

  const exactMatches = BANNED_WORDS.filter((word) => lower.includes(word));
  const normalizedMatches = BANNED_WORDS.filter((word) => normalized.includes(word));

  const allMatches = [...new Set([...exactMatches, ...normalizedMatches])];

  // Optional AI check
  let aiResult: { flagged: boolean; categories: string[] } | null = null;
  try {
    aiResult = await checkWithAI(text);
  } catch {
    // AI check failed silently — local filter still works
  }

  const aiFlagged = aiResult?.flagged ?? false;
  const aiCategories = aiResult?.categories ?? [];

  return {
    flagged: allMatches.length > 0 || aiFlagged,
    matches: allMatches,
    aiFlagged,
    aiCategories,
  };
}

// ─── Notifications ──────────────────────────────────────────────────
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

export async function notifyUser(userId: string, type: string, title: string, message: string, link: string) {
  await prisma.notification.create({
    data: {
      id: crypto.randomUUID(),
      userId,
      type,
      title,
      message,
      link,
    },
  });
}
