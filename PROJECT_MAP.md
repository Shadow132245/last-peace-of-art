# PROJECT_MAP — "The Last Peace of Art"

> Generated: 2026-05-28 | Status: **M1✅ M2✅ M3✅ M4✅ M5✅ M6✅ M6.5✅ M7✅ M8✅**

---

## [RULES]
- **Always push to GitHub after every change** — never keep changes only locally
- **Always read PROJECT_MAP.md first** before any new task to know where we left off
- **Never ask me what we did before** — just read this file

---

## [TECH_STACK]

| Layer        | Technology         | Version     | Status     |
|-------------|-------------------|-------------|------------|
| Framework   | Next.js            | 16.2.6      | ✅ Stable  |
| UI Engine   | React              | 19.2.4      | ✅ Stable  |
| Language    | TypeScript         | 5.8+        | ✅ Stable  |
| Styling     | Tailwind CSS       | 4.3.0       | ✅ Stable  |
| Animation   | Motion (framer-motion) | 12.40.0 | ✅ Stable  |
| Auth        | Better Auth        | 1.6.11      | ✅ Stable  |
| ORM         | Prisma             | 7.8.0       | ✅ Stable  |
| Database    | PostgreSQL (Neon)  | 16          | ✅ Stable  |
| Runtime     | Node.js            | 22 LTS      | ✅ Stable  |
| Package Mgr | npm                | 11.13.0     | ✅ Stable  |

**Deprecation warnings:** None — all packages at latest stable as of 2026-05-28.

---

## [MILESTONES]

| Milestone | Description | Status |
|-----------|------------|--------|
| M1 | Project init, Prisma schema (8 models), Better Auth config | ✅ |
| M2 | Auth system — Login, Register, Google + Email, proxy protection | ✅ |
| M3 | Dashboard CRUD — projects, posts, CV editor, forum threads, settings | ✅ |
| M4 | Public pages — Landing, Blog, Projects, Forum, Profile, 404, SEO | ✅ |
| M5 | Forum system — thread creation, comments, pinned threads | ✅ |
| M6 | UI Polish — responsive navbar, dark mode, animations, Markdown | ✅ |
| M7 | Admin panel, Pagination, Search, Testing | ✅ |
| M8 | Admin content management, Avatar/Banner upload, Landing auth awareness, Forum public create | ✅ |

---

## [SESSION_LOG]

### Session 2026-05-28 (Latest)
**Changes pushed to GitHub — commit `ea8ca63`**

1. **Admin content management** — new pages: `/admin/projects`, `/admin/posts`, `/admin/threads` — each with table listing all items + delete button; new API routes: `DELETE /api/admin/projects/[id]`, `/api/admin/posts/[id]`, `/api/admin/threads/[id]`; reusable `DeleteButton` client component; admin sidebar updated with links
2. **Avatar + Banner upload** — Settings page (`/dashboard/settings`) now has: profile photo upload (stored in `Profile.avatar`), cover banner upload (stored in `Profile.social.banner` JSON), bio + skills editor; Profile API updated to handle all fields; user profile page (`/user/[username]`) displays avatar and banner
3. **Landing page auth-aware** — when logged in: hero buttons show "Go to Dashboard" instead of sign-up, "Ready to share your work?" CTA section is completely hidden
4. **Forum public create button** — "New Thread" button appears on `/forum` for logged-in users (redirects to `/dashboard/forum/new`)

### Previous Sessions
- Facebook OAuth removed (Google + Email only)
- Smooth dark mode transition via global `*` CSS rule
- Page entrance animations (fadeIn, fadeInUp) + hover effects (lift, scale, press)
- Build fixes: `@unique` on `User.name`, `as any` role cast, `PrismaPg` adapter, `force-dynamic` on layouts, Tailwind v4 dark mode variant
- Admin overview + user management (ban/unban) — `/admin`, `/admin/users`
- Pagination utility + component for blog/forum/projects
- PostgreSQL tsvector full-text search
- Vitest + Playwright test setup
- Vercel + Neon deployment

---

## [SYSTEM_FLOW]

### User Roles
```
[Anonymous] ──→ [Registered User] ──→ [Content Creator] ──→ [Admin]
```

### Authentication Flow
```
User ──→ /auth/login ──→ [Google OAuth / Email+Password]
       │
       ├── Google ──→ Better Auth Google Provider ──→ Redirect ──→ Dashboard
       └── Email ────→ Better Auth Credentials ──→ Email Verification ──→ Dashboard
```

---

## [ARCHITECTURE]

```
src/
├── app/
│   ├── (public)/                 # Public routes
│   │   ├── page.tsx              # Landing — auth-aware (hides CTA when logged in)
│   │   ├── blog/                 # Blog listing + [slug]
│   │   ├── projects/             # Project gallery
│   │   ├── forum/                # Forum — "New Thread" button if logged in
│   │   ├── search/               # Full-text search
│   │   └── user/[username]/      # Public profile — shows avatar, banner, bio, skills
│   ├── (auth)/                   # Login / Register
│   ├── (admin)/                  # Admin panel
│   │   ├── layout.tsx            # Sidebar with all admin links
│   │   └── admin/
│   │       ├── page.tsx          # Overview stats
│   │       ├── delete-button.tsx  # Reusable delete client component
│   │       ├── users/            # User list + ban/unban
│   │       ├── projects/         # All projects + delete
│   │       ├── posts/            # All posts + delete
│   │       └── threads/          # All threads + delete
│   ├── dashboard/                # Protected dashboard
│   │   ├── projects/             # My projects CRUD
│   │   ├── posts/                # My posts CRUD
│   │   ├── cv/                   # Profile/bio/skills editor
│   │   ├── forum/                # My threads + new thread
│   │   └── settings/             # Avatar, banner, account, bio, skills
│   ├── api/
│   │   ├── auth/[...all]/        # Better Auth handler
│   │   ├── projects/             # User projects CRUD
│   │   ├── posts/                # User posts CRUD
│   │   ├── profile/              # GET/PUT profile (avatar, bio, skills, social)
│   │   ├── forum/                # Threads + comments
│   │   ├── upload/               # File upload (images, 5MB limit)
│   │   ├── search/               # Full-text search
│   │   └── admin/                # Admin operations
│   │       ├── users/[userId]/   # Ban/unban
│   │       ├── projects/[id]/    # Delete project
│   │       ├── posts/[id]/       # Delete post
│   │       └── threads/[id]/     # Delete thread
│   └── layout.tsx                # Root — dark mode flash prevention script
│
├── proxy.ts                      # Route protection (Next.js 16)
├── components/
│   ├── ui/                       # Button, Input, Markdown, Pagination
│   ├── layout/                   # Navbar (dark toggle, auth-aware), Footer
│   ├── auth/                     # LoginForm, RegisterForm
│   └── forum/                    # CommentForm
├── lib/
│   ├── auth.ts                   # Better Auth server config (Google + Email)
│   ├── auth-client.ts            # Better Auth client (browser)
│   ├── db.ts                     # PrismaClient singleton (PrismaPg adapter)
│   ├── logger.ts                 # pino logger
│   ├── admin.ts                  # requireAdmin() helper
│   └── pagination.ts            # parsePagination, buildPaginationMeta, getSkipTake
├── prisma/
│   └── schema.prisma             # 8 models: User, Session, Account, Verification, Profile, Project, Post, Thread, Comment
├── prisma.config.ts              # Prisma v7 datasource config
└── generated/prisma/             # Generated Prisma client
```

### Schema (Prisma) — Core Entities
```
User        → id, name (unique), email (unique), image, role ("user"/"admin"), banned, banReason, banExpires
Profile     → id, userId, bio, avatar, location, website, company, skills[], social (JSON: {banner}), cv (JSON)
Project     → id, userId, title, description, content, media[], tags[], links (JSON), published
Post        → id, userId, title, slug (unique), content, excerpt, coverImage, tags[], published
Thread      → id, userId, title, content, tags[], pinned, createdAt
Comment     → id, userId, threadId, content, createdAt
```

---

## [CRITICAL_CONTEXT]

| Issue | Solution |
|-------|---------|
| Prisma 7 — `url` in schema datasource not supported | Use `prisma.config.ts` + `PrismaPg` adapter with `connectionString` |
| Better Auth v1 client — no custom user field inference | `(session.user as any).role` for role access |
| Tailwind CSS v4 dark mode — default uses media query | Add `@custom-variant dark (&:where(.dark, .dark *))` for class-based toggle |
| Next.js 16 static generation — client components with browser hooks | Add `export const dynamic = "force-dynamic"` to layouts |
| Smooth theme transition | Global `*` rule: `transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease` |
| Facebook OAuth removed | Only Google + Email; AUTH_FACEBOOK env vars removed |

---

## [ORPHANS & PENDING]

| Item | Status | Notes |
|------|--------|-------|
| Email verification flow | ❌ Pending | Better Auth supports; needs UI |
| Email templates | ❌ Pending | Better Auth supports customization |
| Google OAuth live credentials | ❌ Pending | Need to set AUTH_GOOGLE_ID + AUTH_GOOGLE_SECRET in Vercel |
| Deployed site testing | ❌ Pending | Verify auth flow, dark mode, admin access on live site |

---

## [DEPLOYMENT]

- **Repository:** `github.com/Shadow132245/last-peace-of-art`
- **Hosting:** Vercel (auto-deploy from main branch)
- **Database:** Neon PostgreSQL (serverless)
- **Build command:** `npx prisma generate && next build`
- **Admin user:** Email `fghfghffdgfhfgh@gmail.com` — role set via SQL
