import { PrismaClient } from "../src/generated/prisma/client/index.js";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

const BADGES = [
  { id: "verified", name: "✅ Verified||✅ موثّق", description: "This user's identity has been verified by the site team.||تم التحقق من هوية هذا المستخدم من قبل فريق الموقع.", icon: "✅", color: "blue", howToGet: "Assigned by the site team to notable users.||يتم منحها من قبل فريق الموقع للأعضاء البارزين.", perk: "Verified checkmark on your profile and comments.||علامة توثيق زرقاء في ملفك الشخصي وتعليقاتك." },
  { id: "early-bird", name: "🐦 Early Bird||🐦 مبكر", description: "Among the first users to join the site.||من أوائل مستخدمي الموقع.", icon: "🐦", color: "amber", howToGet: "Awarded to the first 500 registered users.||تمنح لأول 500 مستخدم سجلوا في الموقع.", perk: "Exclusive Early Bird badge on your profile.||شارة مبكر الحصرية على ملفك الشخصي." },
  { id: "content-king", name: "👑 Content King||👑 ملك المحتوى", description: "Published 10 or more posts.||نشر 10 مقالات أو أكثر.", icon: "👑", color: "amber", howToGet: "Publish 10 blog posts on the site.||انشر 10 مقالات في المدونة.", perk: "Pin one post to your profile page.||تثبيت مقال واحد في صفحة ملفك الشخصي." },
  { id: "popular", name: "⭐ Popular||⭐ مشهور", description: "Received 500+ total likes across all content.||حصل على 500+ إعجاب على كل محتواه.", icon: "⭐", color: "yellow", howToGet: "Accumulate 500 likes across all your content.||اجمع 500 إعجاب على كل محتواك.", perk: "Your content appears in the trending section.||محتواك يظهر في قسم الأكثر رواجاً." },
  { id: "bug-hunter", name: "🐛 Bug Hunter||🐛 صائد الأخطاء", description: "Reported and helped fix 3 confirmed bugs.||أبلغ عن 3 أخطاء مؤكدة وساعد في إصلاحها.", icon: "🐛", color: "emerald", howToGet: "Submit 3 confirmed bug reports via the tickets system.||قدم 3 تقارير أخطاء مؤكدة عبر نظام التذاكر.", perk: "Bug Hunter role + access to private beta features.||دور صائد الأخطاء + وصول للميزات التجريبية." },
  { id: "top-commenter", name: "💬 Top Commenter||💬 أفضل معلق", description: "Posted 100+ comments on the site.||نشر 100+ تعليق في الموقع.", icon: "💬", color: "purple", howToGet: "Reach 100 comments across any content.||وصل إلى 100 تعليق على أي محتوى.", perk: "Your comments are highlighted with a special border.||تعليقاتك مميزة بإطار خاص." },
  { id: "helper", name: "🤝 Helper||🤝 المساعد", description: "Helped others with 50+ likes on comments.||ساعد الآخرين وحصل على 50+ إعجاب على تعليقاتك.", icon: "🤝", color: "sky", howToGet: "Earn 50 likes on your comments across the site.||احصل على 50 إعجاب على تعليقاتك.", perk: '"Helper" flair next to your name on comments.||وسام "المساعد" بجانب اسمك في التعليقات.' },
  { id: "veteran", name: "🎖️ Veteran||🎖️ مخضرم", description: "Active member for over 1 year.||عضو نشط لأكثر من سنة.", icon: "🎖️", color: "stone", howToGet: "Be a registered member for 365+ days.||كن عضواً مسجلاً لمدة 365+ يوم.", perk: "Veteran badge + 2x points on all actions.||شارة المخضرم + نقاط مضاعفة على كل الإجراءات." },
  { id: "rising-star", name: "🌟 Rising Star||🌟 نجم صاعد", description: "Your profile gained 1000+ views.||ملفك الشخصي حصل على 1000+ مشاهدة.", icon: "🌟", color: "rose", howToGet: "Get 1000 profile views.||احصل على 1000 مشاهدة لملفك الشخصي.", perk: "Featured on the homepage spotlight section.||يظهر في قسم الأضواء في الصفحة الرئيسية." },
  { id: "premium", name: "💎 Premium||💎 مميز", description: "Premium membership holder.||حامل عضوية مميزة.", icon: "💎", color: "indigo", howToGet: "Assigned for special contributions or purchases.||تمنح للمساهمات المميزة أو الاشتراكات.", perk: "Custom profile theme, priority support, no ads.||ثيم مخصص، دعم أولوي، بدون إعلانات." },
  { id: "elite", name: "🏆 Elite||🏆 النخبة", description: "Earned 5000+ points on the site.||حصل على 5000+ نقطة في الموقع.", icon: "🏆", color: "yellow", howToGet: "Accumulate 5000 points from posting and activity.||اجمع 5000 نقطة من النشر والنشاط.", perk: "Golden profile border + Elite badge.||إطار ذهبي للملف الشخصي + شارة النخبة." },
  { id: "staff", name: "👔 Staff||👔 فريق الموقع", description: "Member of the site staff team.||عضو في فريق إدارة الموقع.", icon: "👔", color: "zinc", howToGet: "Appointed by the site founder.||يتم التعيين من قبل مؤسس الموقع.", perk: "Full access to site management tools.||وصول كامل لأدوات إدارة الموقع." },
];

for (const badge of BADGES) {
  const existing = await prisma.badge.findUnique({ where: { id: badge.id } });
  if (!existing) {
    await prisma.badge.create({ data: badge });
    console.log("Created:", badge.id);
  } else {
    console.log("Skipped (exists):", badge.id);
  }
}
console.log("Done!");
await prisma.$disconnect();
