try { require("dotenv").config(); } catch {}
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const BADGES = [
  ["verified", "✅ Verified||✅ موثّق", "This user's identity has been verified by the site team.||تم التحقق من هوية هذا المستخدم من قبل فريق الموقع.", "✅", "blue", "Assigned by the site team to notable users.||يتم منحها من قبل فريق الموقع للأعضاء البارزين.", "Verified checkmark on your profile and comments.||علامة توثيق زرقاء في ملفك الشخصي وتعليقاتك."],
  ["early-bird", "🐦 Early Bird||🐦 مبكر", "Among the first users to join the site.||من أوائل مستخدمي الموقع.", "🐦", "amber", "Awarded to the first 500 registered users.||تمنح لأول 500 مستخدم سجلوا في الموقع.", "Exclusive Early Bird badge on your profile.||شارة مبكر الحصرية على ملفك الشخصي."],
  ["content-king", "👑 Content King||👑 ملك المحتوى", "Published 10 or more posts.||نشر 10 مقالات أو أكثر.", "👑", "amber", "Publish 10 blog posts on the site.||انشر 10 مقالات في المدونة.", "Pin one post to your profile page.||تثبيت مقال واحد في صفحة ملفك الشخصي."],
  ["popular", "⭐ Popular||⭐ مشهور", "Received 500+ total likes across all content.||حصل على 500+ إعجاب على كل محتواه.", "⭐", "yellow", "Accumulate 500 likes across all your content.||اجمع 500 إعجاب على كل محتواك.", "Your content appears in the trending section.||محتواك يظهر في قسم الأكثر رواجاً."],
  ["bug-hunter", "🐛 Bug Hunter||🐛 صائد الأخطاء", "Reported and helped fix 3 confirmed bugs.||أبلغ عن 3 أخطاء مؤكدة وساعد في إصلاحها.", "🐛", "emerald", "Submit 3 confirmed bug reports via the tickets system.||قدم 3 تقارير أخطاء مؤكدة عبر نظام التذاكر.", "Bug Hunter role + access to private beta features.||دور صائد الأخطاء + وصول للميزات التجريبية."],
  ["top-commenter", "💬 Top Commenter||💬 أفضل معلق", "Posted 100+ comments on the site.||نشر 100+ تعليق في الموقع.", "💬", "purple", "Reach 100 comments across any content.||وصل إلى 100 تعليق على أي محتوى.", "Your comments are highlighted with a special border.||تعليقاتك مميزة بإطار خاص."],
  ["helper", "🤝 Helper||🤝 المساعد", "Helped others with 50+ likes on comments.||ساعد الآخرين وحصل على 50+ إعجاب على تعليقاتك.", "🤝", "sky", "Earn 50 likes on your comments across the site.||احصل على 50 إعجاب على تعليقاتك.", '"Helper" flair next to your name on comments.||وسام "المساعد" بجانب اسمك في التعليقات.'],
  ["veteran", "🎖️ Veteran||🎖️ مخضرم", "Active member for over 1 year.||عضو نشط لأكثر من سنة.", "🎖️", "stone", "Be a registered member for 365+ days.||كن عضواً مسجلاً لمدة 365+ يوم.", "Veteran badge + 2x points on all actions.||شارة المخضرم + نقاط مضاعفة على كل الإجراءات."],
  ["rising-star", "🌟 Rising Star||🌟 نجم صاعد", "Your profile gained 1000+ views.||ملفك الشخصي حصل على 1000+ مشاهدة.", "🌟", "rose", "Get 1000 profile views.||احصل على 1000 مشاهدة لملفك الشخصي.", "Featured on the homepage spotlight section.||يظهر في قسم الأضواء في الصفحة الرئيسية."],
  ["premium", "💎 Premium||💎 مميز", "Premium membership holder.||حامل عضوية مميزة.", "💎", "indigo", "Assigned for special contributions or purchases.||تمنح للمساهمات المميزة أو الاشتراكات.", "Custom profile theme, priority support, no ads.||ثيم مخصص، دعم أولوي، بدون إعلانات."],
  ["elite", "🏆 Elite||🏆 النخبة", "Earned 5000+ points on the site.||حصل على 5000+ نقطة في الموقع.", "🏆", "yellow", "Accumulate 5000 points from posting and activity.||اجمع 5000 نقطة من النشر والنشاط.", "Golden profile border + Elite badge.||إطار ذهبي للملف الشخصي + شارة النخبة."],
  ["staff", "👔 Staff||👔 فريق الموقع", "Member of the site staff team.||عضو في فريق إدارة الموقع.", "👔", "zinc", "Appointed by the site founder.||يتم التعيين من قبل مؤسس الموقع.", "Full access to site management tools.||وصول كامل لأدوات إدارة الموقع."],
];

async function main() {
  const client = await pool.connect();
  try {
    const { rowCount } = await client.query("SELECT COUNT(*) as cnt FROM badge");
    const count = parseInt(rowCount[0].cnt, 10);
    if (count > 0) {
      console.log(`Badges already seeded (${count} existing).`);
      return;
    }
    for (const b of BADGES) {
      await client.query(
        "INSERT INTO badge (id, name, description, icon, color, \"howToGet\", perk, \"createdAt\") VALUES ($1,$2,$3,$4,$5,$6,$7,NOW())",
        b
      );
    }
    console.log(`Seeded ${BADGES.length} badges successfully!`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
