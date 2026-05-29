# 🎨 Last Peace of Art

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-7.8-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Better_Auth-1.6-FF6B6B?style=for-the-badge" alt="Better Auth" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Hosted_on-Vercel-000000?style=for-the-badge&logo=vercel" alt="Vercel" />
</p>

<p align="center">
  <b>منصة مجتمع متكاملة — أنشر إبداعك، شارك أفكارك، تواصل مع ناس زيك.</b>
  <br />
  <a href="https://lastpeace.vercel.app"><strong>🌐 lastpeace.vercel.app</strong></a>
</p>

---

## 📖 إيه هو Last Peace of Art؟

**Last Peace of Art** دي منصة مجتمع متكاملة للفنانين والمبدعين والمطورين. تقدر تعمل فيها:

- 📝 **تنشر Posts** — مقالاتك وأفكارك
- 🚀 **تشارك Projects** — مشاريعك وشغلك
- 💬 **تفتح Threads** — مناقشات في المنتدى
- 👤 **تبني Profile** — بالصورة الشخصية، banner، bio، skills
- 🤝 **تتواصل مع ناس** — رسايل خاصة، أصدقاء
- 🎫 **تفتح Tickets** — لو محتاج مساعدة
- 📋 **تتقدم للإدارة** — نظام Applications
- 🔔 **توصلك إشعارات** — لكل حاجة

---

## ✨ المميزات كاملة

### 👤 المستخدمين
| الميزة | شرحها |
|--------|-------|
| تسجيل دخول | Google OAuth + Email/Password |
| بروفايل كامل | avatar + banner + bio + skills + resize controls |
| رتب | User — Bug Hunter — Admin — Founder |
| View Profile | البروفايل بتاع أي حد مع Threads/Posts/Projects/Comments |

### 📝 المحتوى
| الميزة | شرحها |
|--------|-------|
| posts | مقالات مع markdown، likes، dislikes، comments، views |
| projects | مشاريع مع media gallery، likes، dislikes، comments |
| forum threads | مناقشات مع comments، likes، pinned threads |
| publish/draft toggle | تحكم في النشر |
| search | بحث لايف (أول ما تكتب يظهرلك) بالعربي والإنجليزي |

### 💬 التواصل
| الميزة | شرحها |
|--------|-------|
| رسايل خاصة | شات بين أي يوزرين |
| أصدقاء | إضافة/إزالة/قبول/رفض أصدقاء |
| إشعارات | لايكات، رسايل، تickets، applications، تقارير |

### 🛠️ الإدارة
| الميزة | شرحها |
|--------|-------|
| Admin Panel | overview + users + content + tickets + applications + appeals + reports |
| نظام الرتب | تغيير رتبة أي user |
| حظر/تعليق | ban + suspend مع سبب ومدة |
| Appeals | المستخدمين المعلقين يقدرون يستأنفوا |
| Staff Applications | users يتقدموا، admin يوافق/يرفض |
| Tickets | users يفتحوا tickets، admin يرد |

### 🖼️ الميديا والملفات
| الميزة | شرحها |
|--------|-------|
| رفع صور | 5MB للصورة، 50MB للملفات المضغوطة |
| رفع zip | تقدر ترفع ملفات مضغوطة مع المشاريع |
| Vercel Blob | التخزين السحابي عشان الفايلات متتفسخش |
| data URI fallback | الصور الصغيرة بتتخزن في الداتابيز لو مفيش Blob |
| SafeImg | لو صورة بايظة، بيظهر أول حرف من الاسم بدل الأيكونة المكسورة |

### 🎨 الواجهة
| الميزة | شرحها |
|--------|-------|
| Dark Mode | toggle بين light و dark |
| Animations | motion (framer-motion) — hover, tap, page transitions |
| Responsive | شغالة على الموبايل والتابلت والكمبيوتر |
| Search | بحث لايف مع نتائج مجمعة وlikes/dislikes/views |

---

## 🏗️ العمارة

```
src/
├── app/
│   ├── (public)/          # الصفحات العامة
│   │   ├── blog/          # المقالات
│   │   ├── projects/      # المشاريع
│   │   ├── forum/         # المنتدى
│   │   ├── user/[name]/   # البروفايل
│   │   ├── search/        # البحث
│   │   ├── tickets/       # فتح تذكرة
│   │   ├── apply/         # التقدم للإدارة
│   │   └── ...            # terms, privacy, suspended, appeal
│   ├── (admin)/           # لوحة التحكم
│   │   └── admin/
│   │       ├── users/     # إدارة المستخدمين
│   │       ├── tickets/   # التذاكر
│   │       ├── applications/ # طلبات التقديم
│   │       └── ...        # projects, posts, threads, reports, appeals
│   ├── dashboard/         # لوحة المستخدم
│   │   ├── profile/       # تعديل البروفايل
│   │   ├── messages/      # الرسايل
│   │   ├── friends/       # الأصدقاء
│   │   └── ...            # posts, projects, forum, settings
│   └── api/               # API routes
│       ├── auth/          # Better Auth
│       ├── upload/        # رفع الملفات
│       ├── search/        # البحث
│       ├── messages/      # الرسايل
│       ├── friends/       # الأصدقاء
│       ├── notifications/ # الإشعارات
│       └── admin/         # عمليات الإدارة
├── components/
│   ├── layout/            # Navbar, Footer
│   ├── ui/                # Button, Input, Pagination, ImageUpload, etc.
│   ├── comments/          # نظام التعليقات
│   ├── likes/             # Like/Dislike
│   ├── friends/           # FriendButton
│   └── views/             # ViewTracker
└── lib/
    ├── auth.ts            # Better Auth config
    ├── db.ts              # Prisma client
    └── admin.ts           # requireAdmin() helper
```

---

## 🗄️ قاعدة البيانات (Prisma + Neon PostgreSQL)

```
User → Profile (1:1)
User → Project (1:N)
User → Post (1:N)
User → Thread (1:N)
User → Comment (1:N)
User → Like (1:N)
User → Report (1:N)
User → Appeal (1:N)
User → Ticket (1:N)
User → Application (1:N)
User → Message (sent/received)
User → FriendRequest (sent/received)
User → Notification (1:N)
```

**19 models** في المجمل.

---

## 🛠️ تشغيل المشروع محلياً

```bash
# 1. Clone the repo
git clone https://github.com/Shadow132245/last-peace-of-art.git
cd last-peace-of-art

# 2. Install dependencies
npm install

# 3. اعمل copydulo من .env.example لـ .env
# وعدل الـ DATABASE_URL بتاعك

# 4. شغّل Prisma
npx prisma generate
npx prisma db push

# 5. شغّل السيرفر
npm run dev
```

المشروع هيفتح على `http://localhost:3000`.

---

## 🔐 المتغيرات المطلوبة (.env)

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://..."

# Better Auth
BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET="your-secret-key-min-32-chars"

# OAuth (اختياري)
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""

# Vercel Blob (للرفع الدائم - اختياري)
BLOB_READ_WRITE_TOKEN=""

# Logging
LOG_LEVEL="info"
```

---

## 🚀 النشر على Vercel

```bash
# 1. ادفع الكود لـ GitHub
git push origin main

# 2. في Vercel Dashboard:
#    - Add New Project → استورد الـ repo
#    - Build Command: npx prisma generate && next build
#    - حط المتغيرات من .env في Environment Variables

# 3. استمتع — الموقع شغال!
```

---

## 📋 الرتب والأدوار

| الرتبة | الصلاحيات |
|--------|-----------|
| 👤 **User** | يقرا، يكتب، يرفع |
| 🐛 **Bug Hunter** | ينشر تلقائياً بدون موافقة |
| 🛡️ **Admin** | يدير المستخدمين والمحتوى |
| 👑 **Founder** | كل حاجة + يقدر يغير الرتب |

المؤسس بس هو اللي يقدر يغير الرتب — بيتم التأكد بالايميل `fghfghffdgfhfgh@gmail.com`.

---

## 📸 مميزات بالصور (هنضيفهم قريب)

> قريباً هنضيف screenshots للصفحات الرئيسية.

---

## 🔗 لينكات مهمة

| اللينك | بتروح عشان |
|--------|------------|
| `/` | الصفحة الرئيسية |
| `/blog` | المقالات |
| `/projects` | المشاريع |
| `/forum` | المنتدى |
| `/search` | البحث |
| `/user/[name]` | بروفايل المستخدم |
| `/dashboard` | لوحة المستخدم |
| `/admin` | لوحة الإدارة |
| `/tickets` | فتح تذكرة |
| `/apply` | التقدم للإدارة |
| `/login` | تسجيل الدخول |

---

## 👨‍💻 التقنيات المستخدمة

| التقنية | الاستخدام |
|---------|-----------|
| **Next.js 16** | الإطار الرئيسي |
| **React 19** | واجهة المستخدم |
| **TypeScript 5.8** | اللغة |
| **Tailwind CSS 4** | التنسيق والتصميم |
| **Motion (framer-motion)** | الحركات والأنيميشن |
| **Better Auth 1.6** | نظام المصادقة |
| **Prisma 7.8** | ORM للتعامل مع قاعدة البيانات |
| **Neon PostgreSQL** | قاعدة البيانات |
| **Vercel Blob** | تخزين الملفات الدائم |
| **pino** | تسجيل الأخطاء |

---

## 📝 الترخيص

كل الحقوق محفوظة — **Last Peace of Art** ®

---

<p align="center">
  <b>Last Peace of Art</b> — مكانك عشان تبدع وتشارك وتتواصل.
  <br />
  <a href="https://lastpeace.vercel.app">🌐 lastpeace.vercel.app</a>
</p>
