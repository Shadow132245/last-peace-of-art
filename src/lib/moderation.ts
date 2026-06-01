import { prisma } from "./db";
import { checkWithAI } from "./ai-moderation";

// ═════════════════════════════════════════════════════════════════════
// ENGLISH BANNED WORDS
// ═════════════════════════════════════════════════════════════════════

const ENG_SEXUAL: string[] = [
  "sex", "porn", "porno", "pornography", "xxx", "fuck", "fucking", "fucker", "fucked",
  "shit", "bitch", "asshole", "bastard", "dick", "cock", "cunt", "whore",
  "slut", "blowjob", "handjob", "rimjob", "bukkake", "gangbang",
  "motherfucker", "motherfucking", "dickhead",
  "cum", "cumshot", "semen", "ejaculate", "ejaculation", "orgasm",
  "penis", "vagina", "clit", "clitoris", "labia", "vulva",
  "anal", "anilingus", "cunnilingus", "fellatio", "erection", "erect",
  "masturbate", "masturbation", "masturbating", "wank", "wanker", "wanking",
  "jackoff", "jerkoff", "jerking off",
  "pussy", "pussies", "tits", "titties", "boobs", "breasts", "boobies",
  "naked", "nude", "nudity", "nudes", "stripper", "stripping",
  "prostitute", "prostitution", "escort", "hooker", "call girl",
  "incest", "bestiality", "orgy", "threesome", "bdsm",
  "facial", "creampie", "milf", "squirting",
  "horny", "kinky", "fetish", "bondage",
  "rape", "raping", "rapist", "raped", "molest", "molestation", "molester",
  "pedophile", "pedophilia", "paedophile", "paedophilia",
  "child porn", "child pornography", "cp", "lolita",
  "onlyfans", "only fans",
  "camgirl", "webcam sex",
  "dating escort", "sex dating",
  "swinger", "swinging", "dogging",
  "bareback", "creampie",
  "daddy", "step sis", "step sister",
  "hentai", "yaoi", "yuri", "rule34", "rule 34",
];

const ENG_PROFANITY: string[] = [
  "damn", "goddamn", "hell", "crap", "bullshit", "horseshit",
  "piss", "pissed", "pissing", "piss off", "screw you", "screw that",
  "douche", "douchebag", "jackass", "dumbass", "dumbfuck",
  "son of a bitch", "sonofabitch",
  "arse", "arsehole", "bollocks", "bloody hell",
  "twat", "tit", "prat", "plonker", "wazzock",
  "bugger", "bugger off", "sod off",
  "bint", "berk",
  "git", "munter",
];

const ENG_SLURS: string[] = [
  "nigger", "nigga", "niggah", "niggas",
  "faggot", "fag", "faggotry", "fagget",
  "spic", "spick", "wetback",
  "kike", "chink", "gook", "nip", "slant eye", "slanteye",
  "coon", "darkie", "darky",
  "raghead", "towelhead", "camel jockey",
  "paki", "pajeet",
  "gypo", "pikey", "gypsy",
  "redskin", "squaw",
  "tranny", "transexual", "she-male", "shemale",
  "dyke", "lesbo", "queer",
  "retard", "retarded", "mongoloid", "spaz", "spastic", "window licker",
  "midget", "cripple", "gimp", "handicap",
  "white trash", "trailer trash",
  "beaner", "zip", "border hopper",
  "sand nigger", "sandnigger",
  "jew", "christ killer",
  "cholo", "cracker",
  "gringo", "honky",
];

const ENG_VIOLENCE: string[] = [
  "kill yourself", "kys", "k y s", "kill urself", "kys yourself",
  "suicide", "commit suicide", "suicidal",
  "murder", "murderer", "murdering", "murdered",
  "die", "dying",
  "torture", "torturing", "tortured",
  "behead", "beheading", "decapitate", "decapitation",
  "bomb", "bombing", "terrorist", "terrorism",
  "massacre", "mass shooting", "mass shooter",
  "school shooting", "school shooter",
  "shoot up", "shootup", "shoot the place",
  "stab", "stabbing", "stabbed",
  "hang", "hanging", "hanged",
  "drown", "drowning", "drowned",
  "burn alive", "burning alive",
  "execution", "execute", "executed",
  "genocide", "ethnic cleansing",
  "self harm", "selfharm", "self-harm",
  "cutting myself", "cut my wrist", "cut my wrists",
  "slit my wrist", "slit my throat",
  "jump off a bridge", "jump off building",
  "shoot myself", "shoot myself in the head",
  "overdose on",
  "end my life", "end it all",
  "not worth living",
];

const ENG_DRUGS: string[] = [
  "cocaine", "crack", "crack cocaine", "heroin", "meth", "methamphetamine",
  "ecstasy", "mdma", "lsd", "acid", "mushrooms", "psychedelic", "shrooms",
  "weed", "marijuana", "cannabis", "pot", "hash", "hashish", "ganja",
  "opium", "morphine", "fentanyl", "oxycodone", "xanax", "valium", "diazepam",
  "amphetamine", "speed", "crystal meth", "ice",
  "drug dealer", "drugs", "narcotics", "substance abuse",
  "syringe", "needle", "inject", "intravenous",
  "overdose", "od",
  "pill mill", "rolling", "tripping", "dmt",
  "ketamine", "k hole", "special k",
  "adderall", "ritalin", "vyvanse",
  "lean", "sizzurp", "purple drank",
  "molly", "molly water",
];

const ENG_HATE: string[] = [
  "hate", "haters",
  "die in a fire", "go to hell", "burn in hell", "rot in hell",
  "worthless", "useless", "stupid",
  "idiot", "moron", "imbecile", "dunce", "cretin",
  "loser", "pathetic", "scum", "trash", "garbage",
  "you should die", "nobody likes you", "nobody loves you",
  "go kill yourself", "go die", "kill yourself",
  "incel", "femcel",
  "simp", "cuck", "beta", "alpha",
  "you are a waste", "you are worthless",
  "nobody cares", "shut up", "stfu",
  "fuck off", "go away",
];

const ENG_SCAM: string[] = [
  "free money", "get rich quick", "make money fast", "easy money",
  "click here", "act now", "limited offer", "don't miss out",
  "bitcoin", "crypto", "investment opportunity", "guaranteed returns",
  "work from home", "make money online", "passive income",
  "scam", "fraud", "phishing", "fake",
  "password", "login details", "credit card", "ssn", "social security",
  "bank transfer", "western union", "money gram", "wire transfer",
  "verify your account", "confirm your details", "update your information",
  "you won", "you are the winner", "congratulations you won", "prize winner",
  "gift card", "itunes card", "google play card",
  "cash prize", "lottery", "inheritance",
  "nigerian prince", "foreign prince",
  "urgent action required", "account suspended",
  "claim your prize", "claim now",
];



// ═════════════════════════════════════════════════════════════════════
// ARABIC BANNED WORDS
// ═════════════════════════════════════════════════════════════════════

const AR_SEXUAL: string[] = [
  "جنس", "سكس", "سيكس", "نيك", "نياك", "منيك", "منيوكة",
  "كس", "كساس", "زب", "زبر", "زبوب",
  "بز", "بزاز", "صدر", "نهود",
  "طيز", "طياز", "مؤخرة",
  "شرج", "شرجي",
  "لحس", "مص", "مصاص",
  "دعارة", "عاهرة", "شرموطة", "قحبة", "قحب", "قحبه",
  "عرص", "عروص", "عيورة",
  "خول", "خولات", "خوله",
  "متناك", "منيوك", "منيكة",
  "سحاق", "سحاقية", "مساحقة",
  "لوطي", "لواط", "مثلي", "مثلية",
  "بوية", "بوي",
  "اغتصاب", "مغتصب", "اغتصب", "مغتصبة",
  "تحرش", "متحرش", "تحرش جنسي",
  "استمناء", "عادة سرية", "عادة سرية",
  "قذف", "مني", "سائل منوي",
  "انتصاب", "قضيب", "مهبل", "بظر", "شفران",
  "شهوة", "شهواني",
  "افلام اباحية", "افلام سكس", "موقع سكس",
  "نيك محارم", "سكس مع حيوان",
  "جنس اطفال", "تحرش اطفال", "بيدوفيليا",
  "ولد ومص", "بنت وتص",
  "سكس جماعي", "اورجي", "اورجية",
  "خلفي", "من الخلف", "وضعية",
  "مقاطع سكس", "صور سكس",
  "تعارف جنسي", "زواج عرفي", "متعة",
  "عشيقة", "عشيق", "خليلة",
  "خيانة زوجية", "خيانة",
  "افلام اباحي", "اباحي",
  "رقص", "رقص مثير",
  "ملابس داخلية",
  "غرفة نوم", "علاقة زوجية",
  "فتنة", "مثير",
  "صور عارية", "عارية",
];

const AR_PROFANITY: string[] = [
  "شرموط", "شراميط", "قحب", "عاهرة", "قحبة", "قحاب",
  "كلب", "كلبة", "يا كلب", "كلاب",
  "حمار", "حمارة", "حمير",
  "خنزير", "خنزيرة", "خنازير",
  "بهيمة", "حيوان", "حيوانات",
  "تيس", "عنزة", "غنم",
  "غبي", "غبية", "اغبياء", "تخلف", "اغبى",
  "جاهل", "متخلف", "معتوه", "متخلفة",
  "مجنون", "مجنونة", "جننت", "جنون",
  "انذال", "نذل", "نذلة", "نذالة",
  "حقير", "حقيرة", "حقران", "حقارة",
  "وسخ", "وسخة", "متوسخ", "وساخة",
  "قذر", "قذرة", "قذارة",
  "خسيس", "خسيسة", "خسة",
  "وضيع", "وضيعة", "وضاعة",
  "ابن كلب", "بنت كلب", "اولاد كلب", "ولاد كلب",
  "ابن وسخ", "بنت وسخه", "ولد وسخ",
  "يا حمار", "يا غبي", "يا متخلف", "يا جاهل",
  "تبا", "اللعنة", "لعنك", "لعن الله", "لعنه",
  "عيب", "عار", "فضيحة", "معيبة",
  "يا خسارة", "للأسف",
  "وجهك", "وشك", "وشه",
  "انحاش", "انحش",
];

const AR_SLURS: string[] = [
  "عبد", "عبيد", "عبد الرق",
  "صعيدي", "صعايدة",
  "فلاح", "فلاحة",
  "بدوي", "بدو", "بدوية",
  "صعلوك", "صعاليك",
  "يهودي", "يهود", "يهودية",
  "كفار", "كافر", "كفرة", "ملحد", "الحاد",
  "مشرك", "مشركين", "شرك",
  "رافضي", "روافض",
  "ناصبي", "نواصب",
  "وهابي", "وهابية",
  "اخوان", "اخوانجي",
  "دواعش", "داعشي",
  "ارهابي", "ارهابية", "إرهابي",
  "عميل", "عملاء", "عميلة",
  "خائن", "خونة", "خيانة",
  "متخلف عقلي", "معاق", "معاقة", "معاقين",
  "اعرج", "اعمى", "اطرش", "ابكم", "أعمى",
  "غول", "شيطان", "عفريت", "شيطانة",
  "زنجي", "زنجية", "اسود", "عبد اسود",
  "هنود", "هندي", "هندية",
  "صينيين", "صيني", "صينية",
  "عرقي", "عنصري", "عنصرية",
  "عرب", "عربي",
  "كردي", "أكراد",
  "تركي", "اتراك",
  "فارسي", "فرس",
  "أمريكي", "أمريكان",
  "أوروبي", "أجانب",
];

const AR_VIOLENCE: string[] = [
  "انتحار", "انتحر", "منتحر", "منتحرة", "انتحارية",
  "اقتل", "يقتل", "قتل", "قاتل", "قتلة", "قتلته", "مقتول",
  "اذبح", "يذبح", "ذبح", "دبح", "ذبيح",
  "اضرب", "ضرب", "ضربي", "ضربني",
  "اكسر", "كسر", "تكسر", "مكسور",
  "احرق", "يحرق", "حرق", "حرقان", "محروق",
  "فجر", "تفجير", "متفجرات", "انفجار",
  "سيف", "سكين", "مطواة", "سلاح", "مسدس", "بندقية",
  "دم", "دماء", "دمار", "دمار شامل",
  "تدمير", "هدم", "هدمت",
  "حرب", "حروب", "قتال", "معركة", "حرب عالمية",
  "ألم", "عذاب", "عقاب", "تعذيب",
  "سجن", "مسجون", "حبس", "محبوس",
  "اعدام", "اعدمه", "شنق", "اعدام رميا",
  "ختان", "ختان الاناث", "ختان الذكور",
  "عنف", "عنيف", "عنيفة", "عنف أسري",
  "ارهاب", "ارهابي",
  "تفجير نفسه", "انتحاري", "حزام ناسف",
  "حزام ناسف", "عبوة ناسفة",
  "خطف", "مخطوف", "خطف طفل", "خطف عيال",
  "ضرب", "ضرب نار", "اطلاق نار", "رصاص",
  "طعن", "مطعون",
  "دهس", "دهس بالعربية", "دهس بسيارة",
  "حجر", "رشق", "زجاجة حارقة",
  "اعتداء", "اعتدى",
];

const AR_RELIGIOUS: string[] = [
  "ربنا", "الله", "الإله", "الاله",
  "الدين", "المذهب",
  "قرآن", "قرأن", "مصحف",
  "اسلام", "مسلم", "مسلمين", "مسلمة",
  "مسيحي", "مسيحية", "نصراني", "نصرانية",
  "يهودي", "يهودية",
  "كفر", "كافر", "كفار", "كفرة", "تكفير",
  "الحق", "الحمد لله",
  "سب", "سباب", "شتم",
  "دين", "ملحد", "الحاد", "كفر",
  "كتاب مقدس", "انجيل", "توراة", "زبور",
  "كنيسة", "مسجد", "معبد", "كنائس", "مساجد",
  "حجاب", "نقاب", "برقع", "حجاب شرعي",
  "ملتزم", "ملتزمة", "التزام",
  "متطرف", "متطرفة", "تطرف",
  "جهاد", "جهادي", "مجاهد", "جهاد في سبيل الله",
  "فتنة", "فتن",
  "بدعة", "بدع", "مبتدع",
  "ضلال", "ضال", "ضالة", "ضلالة",
  "شرك", "مشرك",
  "نفاق", "منافق", "منافقة",
  "رسول", "نبي", "صحابة",
  "قرأن كريم", "القرأن",
  "سورة", "آية", "آيات",
  "الشيخ", "المفتي",
  "فتوى", "فتاوي",
];

const AR_HARASSMENT: string[] = [
  "انتحر", "انتحري", "انتحروا",
  "يا خول", "يا عرص", "يا شرموط",
  "حرامي", "حرامية",
  "كذاب", "كذابة", "كذابين", "كذابون",
  "منافق", "منافقة",
  "مخبول", "مخبولة",
  "مريض", "مريضة", "مرضى",
  "مش عجبك", "مش عاجبك", "عيب فيك",
  "تف عليك", "تفو", "تف",
  "يلعن", "ملعون", "لعنك",
  "انذل", "انذال",
  "انشف", "انشفه", "انشفي",
  "اسكت", "اخرس", "اسكتي",
  "بطل", "بطلت", "بطلوا",
  "فشل", "فاشل", "فاشلة", "فاشلين",
  "حظك", "حظك وحش", "حظ سيء",
  "انت فاضي", "فاضي", "فاضية",
  "محروم", "محروومة", "حرمان",
  "نفسي", "نفسية", "نفسيتك",
  "قلة ادب", "قليل الادب",
  "وقح", "وقحة",
  "مغرور", "مغرورة",
  "حاسد", "حسود", "حسد",
  "مخرب", "مخربة",
  "متخلف", "متخلفة",
  "اناني", "انانية",
  "جبان", "جبانة",
  "خاين", "خاينة",
  "نصاب", "نصابة",
  "محتال", "محتالة",
];



// ─── Combine all ─────────────────────────────────────────────────────
const BANNED_WORDS: string[] = [
  ...ENG_SEXUAL, ...ENG_PROFANITY, ...ENG_SLURS,
  ...ENG_VIOLENCE, ...ENG_DRUGS, ...ENG_HATE, ...ENG_SCAM,
  ...AR_SEXUAL, ...AR_PROFANITY, ...AR_SLURS,
  ...AR_VIOLENCE, ...AR_RELIGIOUS, ...AR_HARASSMENT,
];

// ─── Forbidden domain patterns (adult / +18 only) ─────────────────────
const FORBIDDEN_DOMAIN_PATTERNS: string[] = [
  // Porn / adult
  "pornhub", "xvideos", "xnxx", "xhamster", "redtube", "youporn",
  "tube8", "porn", "xvcd", "xvedio", "porntube",
  "xvideo", "hclips", "anyporn", "eporner", "xvideos",
  "spankbang", "pornone", "porn300", "pornve", "pornhat",
  "pornhd", "pornhub", "porndoe", "porngo", "pornvisit",
  "beeg", "vporn", "keezmovies", "extremetube", "pornhub",
  "adult", "adultwork", "adultfriendfinder",
  "onlyfans", "fansly", "manyvids", "justforfans",
  "chaturbate", "livejasmin", "stripchat", "bongacams",
  "cam4", "camster", "myfreecams", "streamate",
  "sex", "sextv", "sexchat", "sexdate",
  "erotic", "erotica", "eroticstories",
  "escort", "escorts", "escortdirectory",
  "swinging", "swinger",
  "bondage", "bdsm",
];

// ─── Pre-compute "missing letter" variants ─────────────────────────
const MISSING_LETTER_MAP = new Map<string, string[]>();
(() => {
  for (const bw of BANNED_WORDS) {
    if (bw.length < 3) continue;
    for (let i = 0; i < bw.length; i++) {
      const variant = bw.slice(0, i) + bw.slice(i + 1);
      const existing = MISSING_LETTER_MAP.get(variant);
      if (existing) {
        if (!existing.includes(bw)) existing.push(bw);
      } else {
        MISSING_LETTER_MAP.set(variant, [bw]);
      }
    }
  }
})();

// ─── Normalize text to catch bypass attempts ────────────────────────
function normalizeText(text: string): string {
  let normalized = text.toLowerCase();

  normalized = normalized.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const subs: Record<string, string> = {
    "0": "o", "1": "i", "2": "z", "3": "e", "4": "a",
    "5": "s", "6": "g", "7": "t", "8": "b", "9": "g",
    "@": "a", "$": "s", "!": "i", "+": "t",
    "#": "h", "%": "x",
  };
  normalized = normalized.split("").map((c) => subs[c] ?? c).join("");

  normalized = normalized.replace(/[.\-*_|]+/g, "");
  normalized = normalized.replace(/(.)\1{2,}/g, "$1$1");

  return normalized;
}

// ─── URL extraction and checking ────────────────────────────────────
function extractUrls(text: string): string[] {
  const urlRegex = /https?:\/\/[^\s<>"']+|www\.[^\s<>"']+/gi;
  const urls = text.match(urlRegex) ?? [];
  return [...new Set(urls.map((u) => u.toLowerCase()))];
}

function checkUrls(text: string): { flagged: boolean; matches: string[] } {
  const urls = extractUrls(text);
  const matchedUrls: string[] = [];

  for (const url of urls) {
    for (const pattern of FORBIDDEN_DOMAIN_PATTERNS) {
      if (url.includes(pattern)) {
        matchedUrls.push(url);
        break;
      }
    }
  }

  return { flagged: matchedUrls.length > 0, matches: matchedUrls };
}

// ─── Main check ─────────────────────────────────────────────────────
export async function checkContent(text: string, userRole?: string): Promise<{
  flagged: boolean;
  matches: string[];
  aiFlagged?: boolean;
  aiCategories?: string[];
  urlFlagged?: boolean;
  urlMatches?: string[];
}> {
  if (userRole === "founder") {
    return { flagged: false, matches: [], aiFlagged: false, aiCategories: [], urlFlagged: false, urlMatches: [] };
  }

  const lower = text.toLowerCase();
  const normalized = normalizeText(text);

  // 1 — Exact word match
  const exactMatches = BANNED_WORDS.filter((word) => lower.includes(word));

  // 2 — Normalized match (leetspeak + separators + repeats)
  const normalizedMatches = BANNED_WORDS.filter((word) => normalized.includes(word));

  // 3 — Missing-letter match
  const missingLetterMatches: string[] = [];
  for (const w of normalized.split(/\s+/)) {
    if (w.length < 2) continue;
    const candidates = MISSING_LETTER_MAP.get(w);
    if (candidates) missingLetterMatches.push(...candidates);
  }

  // 4 — URL domain check
  const { flagged: urlFlagged, matches: urlMatches } = checkUrls(text);

  const allMatches = [
    ...new Set([...exactMatches, ...normalizedMatches, ...missingLetterMatches]),
  ];

  // 5 — Optional AI check (Gemini / OpenAI)
  let aiResult: { flagged: boolean; categories: string[] } | null = null;
  try {
    aiResult = await checkWithAI(text);
  } catch {
    // AI check fails silently
  }

  const aiFlagged = aiResult?.flagged ?? false;
  const aiCategories = aiResult?.categories ?? [];

  return {
    flagged: allMatches.length > 0 || aiFlagged || urlFlagged,
    matches: allMatches,
    aiFlagged,
    aiCategories,
    urlFlagged,
    urlMatches,
  };
}

// ─── Notifications ──────────────────────────────────────────────────
export async function notifyAdmins(type: string, title: string, message: string, link: string) {
  const admins = await prisma.user.findMany({
    where: { OR: [{ role: "admin" }, { role: "founder" }, { roles: { has: "admin" } }, { roles: { has: "founder" } }] },
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
