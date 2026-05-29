# PROJECT_MAP — "The Last Peace of Art"

> Generated: 2026-05-29 | Status: **M1✅ M2✅ M3✅ M4✅ M5✅ M6✅ M6.5✅ M7✅ M8✅ M9✅ M10✅ M11✅ M12✅ M13✅ M14✅ M15✅ M16✅ M17✅**

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
| M9 | Profile editor with resize controls, Terms & Privacy pages, CV removal, Settings cleanup | ✅ |
| M10 | Interactions — unified comments, likes/dislikes, reports, views, trending sidebars, admin reports | ✅ |
| M11 | Admin panel redesign + animations — publish/draft toggle, motion animations, shared components, page transitions | ✅ |
| M12 | Admin moderation — Accept/Reject workflow, optimistic UI, forum published filter, contact email, build fixes | ✅ |
| M13 | Suspension + Appeals system — proxy check, suspend modal, admin appeals page, appeal form, suspension notice | ✅ |
| M14 | Admin clickable titles, image upload in editors, security headers, source maps disabled | ✅ |
| M15 | Notifications system + Ticket system + Admin tickets panel + Role badges + Profile links | ✅ |
| M16 | File uploads (zip), Bug Hunter auto-approval, Applications system (form + admin + accept/reject) | ✅ |
| M17 | Messaging/chat UI, Friend requests system, Profile interact buttons (message/add friend) | ✅ |

---

## [SESSION_LOG]

### Session 4 — 2026-05-29 (Latest — commit `475e370` → current)

1. **File uploads (zip)** — upload API now accepts zip files up to 50MB; `ImageUpload` component now handles both images and zip files
2. **Bug Hunter auto-approval** — posts/projects/threads created by `bug_hunter` users are automatically `published: true`
3. **Applications system** — `Application` create API, admin GET/PATCH API (accept/reject); approved applications auto-set user role to `admin`; admins notified on new application
4. **Application form** — `/apply` page with 6 questions (experience, strengths, weaknesses, conflict handling, activity hours, reason)
5. **Admin applications page** — `/admin/applications` with expandable answers, status badges, Approve/Reject buttons, response shown
6. **Messaging system** — `Message` API (POST send, GET conversations, GET chat with user); sends notification to receiver
7. **Messages UI** — `/dashboard/messages` with conversation sidebar + real-time-like chat window
8. **Friends system** — `FriendRequest` API (POST send, PATCH accept/reject, GET pending, GET friends list, DELETE unfriend); sends notification on request and acceptance
9. **Friends UI** — `/dashboard/friends` with 3 tabs: Friends list, Pending requests, Add Friend (search users)
10. **Profile interact buttons** — `/user/[name]` now has "Send Message" (links to `/dashboard/messages?userId=`) and "Add Friend" (client component with sent state)
11. **Dashboard updates** — added Messages, Friends, Support Tickets, Apply for Staff cards; message count + friend count shown
12. **Navbar updates** — Messages and Friends links added for authenticated users (desktop + mobile)
13. **All pushed to GitHub**

### Session 3 — 2026-05-29 (commit `475e370`)

1. **Notification system** — `Notification` model + API (GET/POST/PATCH read) + `NotificationBell` component polls every 30s, integrated in navbar
2. **Ticket system** — `Ticket` model + user API (POST/GET) + admin API (GET all/PATCH status+response) + admin tickets page with inline status dropdown + response textarea
3. **User profile enhancements** — role badges (FOUNDER amber, ADMIN purple, BUG HUNTER emerald), threads section with comment counts, recent comments section
4. **Profile links** — forum threads, blog posts, projects: click author name → `/user/[name]` with avatar + role badges
5. **Role management** — `RoleButton` in admin users page to assign any role to any user
6. **Admin sidebar** — added Tickets and Applications nav items
7. **Report notifications** — when a report is submitted, all admins/founders receive a notification
8. **All pushed to GitHub** — commit `475e370`

### Session 2 — 2026-05-29 (commits `7e75875` → `93333dd`)

1. **Suspension check in proxy.ts** — redirects suspended users to `/suspended` (bypass for `/suspended` and `/appeal` pages)
2. **`suspended` added to Better Auth additionalFields** — session now includes `suspended`, `suspensionReason`, `suspendedUntil`
3. **Suspension notice page** — `(public)/suspended/page.tsx` shows reason, duration (permanent/temporary), link to appeal
4. **Appeal form page** — `(public)/appeal/page.tsx` — client component with reason dropdown + description textarea; validates suspension status + no pending appeal limit
5. **Admin appeals page** — `(admin)/admin/appeals/page.tsx` + `appeal-actions.tsx` — lists all appeals with user info, status badges, Approve/Reject buttons for pending
6. **Admin users — suspend button with modal** — `suspend-button.tsx`: modal with reason input + duration selector (1d/3d/7d/14d/30d/permanent); Unsuspend button when already suspended
7. **Users page updated** — shows `Suspended` badge + suspension reason in status column
8. **Admin sidebar** — added "Appeals" nav item
9. **`force-dynamic` added to all admin pages** — fixed prerender errors against Neon DB
10. **Admin clickable titles** — posts link to `/blog/[slug]`, projects link to `/projects/[id]` (threads already had it)
11. **ImageUpload component** — `src/components/ui/image-upload.tsx`: reusable upload button (supports markdown insert, URL insert, media array)
12. **Image upload in post editor** — "Add Image" button inserts `![alt](url)` into markdown content
13. **Image upload in project editor** — "Add Image" for content + media gallery with thumbnails (add/remove)
14. **Image upload in forum editor** — "Add Image" button inserts `![alt](url)` into content
15. **Project POST API** — now accepts `content` (markdown) and `media` (string[]) fields
16. **Security headers** — `next.config.ts`: HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy + production source maps disabled
17. **All pushed to GitHub** — commit `93333dd`

### Session 2026-05-28 — commit `ab372d0` / `fb488ac`
1. **Profile editor page** — `/dashboard/profile` with avatar upload + size slider, banner upload + height slider, bio, skills, live preview
2. **Terms of Service + Privacy Policy** pages — full legal policies
3. **CV removed** — replaced with Profile in dashboard/landing
4. **Settings simplified** — account info only
5. **User profile page** — reads `avatarSize`/`bannerHeight` from social JSON
6. **Immediate upload preview** — `URL.createObjectURL`
7. **"Blog" renamed to "Posts"** — navbar, footer, metadata, feature cards
8. **Publish/Draft toggle** — clickable status badge in `/dashboard/posts`

Previous session — commit `ea8ca63`:
1. **Admin content management** — `/admin/projects`, `/admin/posts`, `/admin/threads` with delete
2. **Avatar + Banner upload** in Settings (later moved to `/dashboard/profile`)
3. **Landing page auth-aware** — CTA hidden when logged in
4. **Forum public create button** — visible for logged-in users

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
│   │   ├── blog/                 # Blog listing + [slug] — popular sidebar, comments, likes, views
│   │   ├── projects/             # Project gallery + [id] detail — trending sidebar, media, comments, likes
│   │   ├── forum/                # Forum listing + [threadId] detail — hot sidebar, comments, likes
│   │   ├── search/               # Full-text search
│   │   ├── terms/                # Terms of Service
│   │   ├── privacy/              # Privacy Policy
│   │   ├── suspended/            # Suspension notice page
│   │   ├── appeal/               # Appeal submission form
│   │   ├── tickets/              # Ticket submission form
│   │   ├── apply/                # Staff application form (6 questions)
│   │   └── user/[username]/      # Public profile — avatar, banner, bio, skills, threads, comments, role badges, msg/friend buttons
│   ├── (auth)/                   # Login / Register
│   ├── (admin)/                  # Admin panel
│   │   ├── layout.tsx            # Sidebar (reports/tickets/applications links added)
│   │   └── admin/
│   │       ├── page.tsx          # Overview stats
│   │       ├── delete-button.tsx # Reusable delete client component
│   │       ├── users/            # User list + ban/unban + suspend modal + role button
│   │       ├── projects/         # All projects + delete
│   │       ├── posts/            # All posts + delete
│   │       ├── threads/          # All threads + delete
│   │       ├── reports/          # Reports list + inline resolve
│   │       ├── appeals/          # Appeals list + approve/reject
│   │       ├── tickets/          # Tickets list + inline status change + response
│   │       └── applications/     # Applications list + accept/reject
│   ├── dashboard/                # Protected dashboard
│   │   ├── projects/             # My projects CRUD
│   │   ├── posts/                # My posts CRUD + publish/draft toggle
│   │   ├── profile/              # Avatar, banner, bio, skills + live preview + resize
│   │   ├── forum/                # My threads + new thread
│   │   └── settings/             # Account info + sign out only
│   ├── api/
│   │   ├── auth/[...all]/        # Better Auth handler
│   │   ├── projects/             # User projects CRUD (bug_hunter auto-publish)
│   │   ├── posts/                # User posts CRUD + publish toggle (bug_hunter auto-publish)
│   │   ├── profile/              # GET/PUT profile (avatar, bio, skills, social)
│   │   ├── forum/                # Threads + comments (bug_hunter auto-publish)
│   │   ├── upload/               # File upload (images 5MB, zip 50MB)
│   │   ├── search/               # Full-text search
│   │   ├── comments/             # Unified POST/GET/DELETE comments
│   │   ├── likes/                # POST toggle like/dislike, GET counts
│   │   ├── reports/              # POST create report + notifies admins
│   │   ├── views/                # POST increment view counter
│   │   ├── notifications/        # GET user notifications, POST create, PATCH read
│   │   ├── tickets/              # POST create ticket, GET user tickets
│   │   ├── applications/         # POST create application (staff)
│   │   ├── messages/             # GET conversations, POST send message, GET/[userId] chat
│   │   ├── friends/              # GET friends, DELETE unfriend
│   │   ├── friends/requests/     # GET pending, POST send request
│   │   ├── friends/requests/[id] # PATCH accept/reject request
│   │   └── admin/                # Admin operations
│   │       ├── users/[userId]/   # Ban/unban + suspend/unsuspend + role change
│   │       ├── projects/[id]/    # Delete project
│   │       ├── posts/[id]/       # Delete post
│   │       ├── threads/[id]/     # Delete thread
│   │       ├── reports/          # GET all + PATCH resolve
│   │       ├── appeals/          # GET all + PATCH approve/reject by id
│   │       ├── tickets/          # GET all tickets
│   │       ├── tickets/[id]/     # PATCH status + response + notify user
│   │       ├── applications/     # GET all applications
│   │       └── applications/[id]/ # PATCH approve/reject + notify + auto-role
│   ├── appeals/                  # POST submit appeal (suspended users only)
│   └── layout.tsx                # Root — dark mode flash prevention script
│
├── next.config.ts                # Security headers + source maps disabled
├── proxy.ts                      # Route protection + suspension redirect (Next.js 16)
├── components/
│   ├── ui/                       # Button, Input, Markdown, Pagination, ImageUpload, NotificationBell, admin components
│   ├── layout/                   # Navbar (dark toggle, auth-aware, NotificationBell, Messages/Friends links), Footer
│   ├── auth/                     # LoginForm, RegisterForm
│   ├── comments/                 # CommentSection (shared b/w blog/projects/forum)
│   ├── likes/                    # LikeButton (optimistic UI, SVG icons)
│   ├── reports/                  # ReportButton (modal with reason + description)
│   ├── views/                    # ViewTracker (client component, POST on mount)
│   └── friends/                  # FriendButton (add friend, sent state, loading)
├── lib/
│   ├── auth.ts                   # Better Auth server config (Google + Email)
│   ├── auth-client.ts            # Better Auth client (browser)
│   ├── db.ts                     # PrismaClient singleton (PrismaPg adapter)
│   ├── logger.ts                 # pino logger
│   ├── admin.ts                  # requireAdmin() helper
│   └── pagination.ts            # parsePagination, buildPaginationMeta, getSkipTake
├── prisma/
│   └── schema.prisma             # 14 models (+ Appeal, suspended fields on User)
├── prisma.config.ts              # Prisma v7 datasource config
└── generated/prisma/             # Generated Prisma client
```

### Schema (Prisma) — Core Entities (19 models)
```
User          → id, name (unique), email, role, banned, banReason, banExpires, suspended, suspendedAt, suspendedUntil, suspensionReason
Profile       → id, userId, bio, avatar, location, website, company, skills[], social (JSON: {banner, avatarSize, bannerHeight})
Project       → id, userId, title, description, content, media[], tags[], links (JSON), published, views, likesCount, dislikesCount
Post          → id, userId, title, slug (unique), content, excerpt, coverImage, tags[], published, views, likesCount, dislikesCount
Thread        → id, userId, title, content, tags[], pinned, published, views, likesCount, dislikesCount
Comment       → id, content, threadId?, postId?, projectId?, userId (polymorphic)
Like          → id, userId, entityType, entityId, type @@unique([userId, entityType, entityId])
Report        → id, userId, entityType, entityId, reason, description?, resolved
Appeal        → id, userId, reason, description?, status, adminResponse?, reviewedAt?
Ticket        → id, userId, title, description, category, status, adminResponse?, resolvedAt?
Application   → id, userId, answers (JSON), status, adminResponse?, reviewedAt?
Message       → id, content, senderId, receiverId, read
FriendRequest → id, senderId, receiverId, status @@unique([senderId, receiverId])
Notification  → id, userId, type, title, message?, link?, read
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
| Comments polymorphic | Single Comment model with optional threadId/postId/projectId |
| Likes unique constraint | `@@unique([userId, entityType, entityId])` prevents duplicate likes |
| Report enriched inline | Admin reports page fetches entity title/author via Promise.all (no denormalization) |
| ViewTracker client component | Returns null, calls fetch once on mount — no server-side interaction |
| Suspension separate from Ban | `suspended`/`suspendedUntil`/`suspensionReason` distinct from `banned`/`banExpires` — temporary vs permanent |
| Appeal one-pending limit | API rejects second appeal if one is already pending |
| `suspended` in Better Auth session | Added to `additionalFields` in `auth.ts` so `(session.user as any).suspended` works client-side |
| `force-dynamic` on admin pages | All admin server components need it to prevent prerender errors against Neon |

| Security headers | Set via `next.config.ts` headers() — HSTS 2yr, X-Frame-Options DENY, X-Content-Type-Options nosniff |
| Source maps | `productionBrowserSourceMaps: false` prevents source code leak |
| Bug Hunter auto-publish | Posts/projects/threads created by `bug_hunter` role users auto-set `published: true` |
| Zip file uploads | Upload API accepts `application/zip` up to 50MB; `ImageUpload` component accepts `.zip` |
| Application approve → admin role | When application is approved, user role auto-set to `admin` |
| Friend request flow | Request → notification → accept/reject → notification back to sender |
| Messages notification | Sending a message creates a notification for the receiver with link to `/dashboard/messages` |
| Conversations deduped | Messages API groups by user, returns latest message per conversation |

---

## [ORPHANS & PENDING]

| Item | Status | Notes |
|------|--------|-------|
| Email verification flow | ❌ Pending | Better Auth supports; needs UI |
| Email templates | ❌ Pending | Better Auth supports customization |
| Google OAuth live credentials | ❌ Pending | Need to set AUTH_GOOGLE_ID + AUTH_GOOGLE_SECRET in Vercel |
| Deployed site testing | ❌ Pending | Verify all features end-to-end |
| Read receipts for messages | ❌ Pending | Mark messages as read when opened |
| WebSocket for real-time chat | ❌ Pending | Currently uses REST + manual refresh |

---

## [DEPLOYMENT]

- **Repository:** `github.com/Shadow132245/last-peace-of-art`
- **Hosting:** Vercel (auto-deploy from main branch)
- **Database:** Neon PostgreSQL (serverless)
- **Build command:** `npx prisma generate && next build`
- **Admin user:** Email `fghfghffdgfhfgh@gmail.com` — role set via SQL
