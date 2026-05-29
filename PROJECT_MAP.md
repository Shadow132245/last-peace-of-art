# PROJECT_MAP — "The Last Peace of Art"

> Generated: 2026-05-29 | Status: **M1✅ M2✅ M3✅ M4✅ M5✅ M6✅ M6.5✅ M7✅ M8✅ M9✅ M10✅ M11✅ M12✅ M13✅ M14✅ M15✅ M16✅ M17✅ M18✅ M19✅ M20✅ M21✅ M22✅ M23✅ M24✅**

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
| File Storage | Vercel Blob        | —           | ✅ Integrated |

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
| M18 | Persistent file storage — Vercel Blob + data URI fallback: uploads use Vercel Blob (if token set) or base64 data URI in DB (small images <500KB) to survive redeployments; local filesystem as last resort | ✅ |
| M19 | Profile 404 fix, RoleButton redesign with founder option, case-insensitive username lookup | ✅ |
| M20 | User avatar dropdown in navbar — click avatar to view profile, posts, threads, projects, dashboard, settings, sign out | ✅ |
| M21 | Live search rewrite — debounced input, grouped results (posts/projects/threads/users), rich cards with username/likes/dislikes/views/comment count | ✅ |
| M22 | Ban system fix — banned users blocked from ALL pages via layout checks; suspended users blocked from dashboard/admin; upload persistence — data URI threshold raised to 2MB; upload error handling + revert in profile dashboard | ✅ |
| M23 | Upload reliability — ALL images use data URI when Blob unavailable (no size limit); Blob failure degrades to data URI instead of crashing; navbar avatar syncs with profile avatar (User.image updated on save) | ✅ |
| M24 | UI Animation overhaul — favicon update; PageTransition on auth layout; motion on login/register/banned/404; AnimatedList on forum; FadeInView on all content pages; StaggerList on dashboard lists; motion on all dashboard forms | ✅ |

---

## [SESSION_LOG]

### Session 14 — 2026-05-29

1. **Favicon updated** — changed from SVG "LP" logo to new circular image; updated `layout.tsx` metadata to use `favicon.png` with proper `icon` and `apple` link tags
2. **Auth layout animation** — `(auth)/layout.tsx` now wraps children in `<PageTransition>` for fade-in on login/register pages
3. **Login + Register pages** — converted to client components with `motion.div` fade-in-up animation
4. **Banned page redesign** — converted to client component with staggered spring/scale animations for emoji, heading, card, text, and button
5. **404 page animation** — converted to client component with spring scale-in for "404" number, fade-in for text and button
6. **Forum list page fix** — `AnimatedList`/`AnimatedItem` were imported but unused; now properly wraps thread cards with stagger fade-in animation
7. **Content detail pages** — `blog/[slug]`, `projects/[id]`, `forum/[threadId]` all got `FadeInView` wrappers for title, metadata, tags, like/report buttons, content, media, and comments sections with staggered delays
8. **User profile page** — banner, header, threads, projects, posts, comments sections each wrapped in `FadeInView` with staggered delays
9. **Suspended page** — icon, heading, reason card, appeal text each wrapped in `FadeInView`
10. **Terms + Privacy pages** — title, date, and content sections wrapped in `FadeInView`
11. **Search page** — added `motion.div` page entry, `StaggerList`/`StaggerItem` for grouped results with staggered card animations
12. **Dashboard home** — welcome section in `FadeInView`, stat cards and quick links wrapped in `StaggerList`/`FadeInView`
13. **Dashboard list pages** — forum, projects, posts: headings in `FadeInView`, list items in `StaggerList`/`StaggerItem`
14. **Dashboard form pages** — forum/new, projects/new, posts/new: `motion.h1` + `motion.form` with fade-in-up animation
15. **Dashboard settings** — `motion.div` wrapper with staggered fade-in for heading, info card, sign out button
16. **Dashboard profile** — `motion.div` wrapper with fade-in for heading and editor layout

### Session 13 — 2026-05-29 (commits `8a0375c` → `c72d66a`)

1. **Upload API: removed image size limit for data URI** — `isSmallImage()` function deleted; ALL images (any size) convert to base64 data URI when Blob is unavailable. This fixes upload failure on Vercel where writing to `public/uploads/` fails due to read-only filesystem
2. **Blob failure graceful degradation** — if `uploadToBlob()` returns null, now falls back to data URI instead of crashing on local filesystem
3. **Non-image file warning** — without Blob token, non-image files (zip) log a warning that they won't persist, still try to save locally as best-effort
4. **Better error message in catch block** — upload API now includes actual error message in the response instead of generic "Upload failed"
5. **Client-side network error handling** — fetch wrapped in try/catch; if JSON parse fails, graceful fallback to empty object; error message suggests smaller image or Vercel Blob setup

### Session 12 — 2026-05-29 (commit `e7419b4`)

1. **Ban system implemented** — created `/banned` page at `src/app/banned/page.tsx` (outside `(public)` route group to avoid redirect loop) showing a clear "Account Banned" message with Contact Support link
2. **Ban check in public layout** — `(public)/layout.tsx` now fetches session and checks `user.banned` → redirects to `/banned` immediately for ALL public pages
3. **Ban + suspended check in dashboard layout** — `dashboard/layout.tsx` checks banned → `/banned`, suspended → `/suspended`
4. **Ban + suspended check in admin layout** — `(admin)/layout.tsx` (client component) now checks banned → `/banned`, suspended → `/suspended` before admin role check
5. **Deleted dead proxy.ts** — the `proxy.ts` file had suspend redirect logic but was never imported anywhere, making it completely dead code
6. **Data URI threshold raised** — from 500KB to 2MB in `upload/route.ts` `isSmallImage()`, so profile images up to 2MB are stored as base64 data URIs in the database instead of being lost on Vercel redeploy
7. **Upload error handling in profile dashboard** — added `avatarPrev`/`bannerPrev` state to remember previous values; if upload fails, reverts to the previous value and shows error message; added `uploadError` state with red error text display

### Session 11 — 2026-05-29 (commit `f8fa419`)

1. **SafeImg / SafeBanner components** — client components that gracefully handle broken image URLs: `SafeImg` falls back to showing initials (or hides); `SafeBanner` hides entirely on error. Prevents broken image icons from showing in profile page when old upload URLs are stale
2. **Profile page updated** — banner and avatar `<img>` tags replaced with `SafeBanner` and `SafeImg` for graceful degradation

### Session 10 — 2026-05-29 (commit `9d0ea1b`)

1. **Search API rewrite** — replaced tsvector full-text search with Prisma `findMany` + `contains` + `mode: "insensitive"` for cross-language support (Arabic, English). Added forum threads to search results. Each result now includes: `userName`, `userId`, `userImage`, `likesCount`, `dislikesCount`, `views`, `commentCount`
2. **Search page rewrite** — single client component with debounced live search (200ms) instead of form submit. Results grouped by type (Posts, Projects, Threads, Users). Each result card shows type badge, title, description, user avatar+name link, likes/dislikes/views/comment icons with counts. Removed old `search-input.tsx` and `search-results.tsx`
3. **Profile page posts/projects clickable** — wrapped in `<Link>` to navigate to full detail pages

### Session 9 — 2026-05-29 (commit `173162f`)

1. **Profile posts/projects now clickable** — wrapped project cards in `<Link href={/projects/[id]}>` and post cards in `<Link href={/blog/[slug]}>` so clicking from profile goes to full detail page; added hover effects for consistency with threads

### Session 8 — 2026-05-29 (commits `c59e440` → `807b61b`)

1. **Profile 404 fix v2** — added `decodeURIComponent()` for username params to handle spaces and special characters in profile URLs (e.g. `Hassan%20Magdy`)
2. **Data URI fallback for small images** — upload API now stores small images (<500KB) as base64 data URIs when no `BLOB_READ_WRITE_TOKEN` is set, ensuring avatars, banners, and profile images persist in the database even without external cloud storage

### Session 7 — 2026-05-29 (commit `c8381fc`)

1. **User avatar dropdown in navbar** — added clickable avatar (with fallback initials) in desktop navbar that opens a dropdown menu with links to: View Profile, Dashboard, My Posts, My Threads, My Projects, Messages, Friends, Settings, Admin (if role allows), Sign Out
2. **Mobile nav updated** — added View Profile, Messages, Friends links in mobile menu for authenticated users
3. **TypeScript fix** — `findUniqueOrThrow` instead of `findUnique` in profile page to eliminate `user possibly null` error

### Session 6 — 2026-05-29 (commit `50bc746`)

1. **Profile page 404 fix** — added `force-dynamic`, created `findUser()` that tries exact name match then case-insensitive fallback to prevent 404 on username casing/encoding differences
2. **RoleButton redesign** — replaced native `<select>` with a custom animated dropdown matching site theme (motion animations, dark mode, hover states)
3. **Founder option added** — `founder` role now appears in the dropdown with amber color and dot indicator; checkmark shown on selected item
4. **Click-outside-to-close** — dropdown closes when clicking elsewhere on the page

### Session 5 — 2026-05-29 (commit `d237642`)

1. **Vercel Blob integration** — installed `@vercel/blob` package, rewrote upload API to use `BLOB_READ_WRITE_TOKEN` env var for persistent cloud storage
2. **Upload API updated** — `POST /api/upload` now uploads to Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set, with automatic fallback to local `public/uploads/` for development
3. **.env.example updated** — added `BLOB_READ_WRITE_TOKEN` placeholder
4. **PROJECT_MAP.md updated** — Session 5 entry, M18 milestone, Vercel Blob in tech stack, critical context additions
5. **Solution to disappearing uploads** — uploads (avatars, banners, images, zip) now persist across Vercel deployments via Vercel Blob storage
6. **User must set up Blob store** — go to Vercel Dashboard → Storage → Create Blob Store → add `BLOB_READ_WRITE_TOKEN` to environment variables in Vercel Dashboard

### Session 4 — 2026-05-29 (commits `475e370` → `16fc21f` → `f32cb23`)

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
13. **All pushed to GitHub** — commit `16fc21f`
14. **Vercel TypeScript fix** — `admin/layout.tsx`: moved null check for `res.data` before accessing `role` to fix production build error. Commit `f32cb23`

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
│   │   ├── layout.tsx            # Banned check — redirects to /banned
│   │   ├── page.tsx              # Landing — auth-aware (hides CTA when logged in)
│   │   ├── blog/                 # Blog listing + [slug] — popular sidebar, comments, likes, views
│   │   ├── projects/             # Project gallery + [id] detail — trending sidebar, media, comments, likes
│   │   ├── forum/                # Forum listing + [threadId] detail — hot sidebar, comments, likes
│   │   ├── search/               # Live search — debounced input, grouped results, rich cards with likes/dislikes/views/username
│   │   ├── terms/                # Terms of Service
│   │   ├── privacy/              # Privacy Policy
│   │   ├── suspended/            # Suspension notice page
│   │   ├── appeal/               # Appeal submission form
│   │   ├── tickets/              # Ticket submission form
│   │   ├── apply/                # Staff application form (6 questions)
│   │   └── user/[username]/      # Public profile — avatar, banner, bio, skills, threads, comments, role badges, msg/friend buttons
│   ├── (auth)/                   # Login / Register
│   ├── (admin)/                  # Admin panel — banned + suspended + role check in layout
│   │   ├── layout.tsx            # Sidebar, banned/suspended/role checks
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
│   ├── dashboard/                # Protected dashboard — banned + suspended check in layout
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
│   │   ├── upload/               # File upload (images 5MB, zip 50MB) — Blob → data URI (any size) → local (non-image only)
│   │   ├── search/               # Full-text search — posts/projects/threads/users with likes/dislikes/views
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
│   ├── banned/                   # Banned notice page (no navbar/footer)
│   ├── appeals/                  # POST submit appeal (suspended users only)
│   └── layout.tsx                # Root — dark mode flash prevention script
│
├── next.config.ts                # Security headers + source maps disabled
├── components/
│   ├── ui/                       # Button, Input, Markdown, Pagination, ImageUpload, NotificationBell, admin components
│   ├── layout/                   # Navbar (dark toggle, auth-aware, NotificationBell, Messages/Friends links), Footer
│   ├── auth/                     # LoginForm, RegisterForm
│   ├── comments/                 # CommentSection (shared b/w blog/projects/forum)
│   ├── likes/                    # LikeButton (optimistic UI, SVG icons)
│   ├── reports/                  # ReportButton (modal with reason + description)
│   ├── views/                    # ViewTracker (client component, POST on mount)
│   ├── friends/                  # FriendButton (add friend, sent state, loading)
│   └── ui/safe-image.tsx         # SafeImg / SafeBanner — graceful fallback for broken image URLs
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
| Persistent file storage | 3-tier: Vercel Blob (cloud) → data URI in DB (all images, any size) → local `public/uploads/` (non-image only, dev) |
| Vercel filesystem ephemeral | Files written to `public/uploads/` are lost on next deploy — Blob + data URI solve this |
| Data URI for ALL images | No size limit — any image (any size) converts to base64 data URI when Blob unavailable, persists in DB forever |
| Vercel filesystem READ-ONLY | Writing to `public/uploads/` on Vercel serverless fails (EROFS) — removed image size limit to always use data URI |
| Blob env var | `BLOB_READ_WRITE_TOKEN` in Vercel Dashboard → env vars enables Vercel Blob for all files including large ones and zips |
| Blob failure degradation | If `uploadToBlob()` returns null, gracefully falls back to data URI instead of crashing |
| Navbar avatar sync | `PUT /api/profile` now updates `User.image` when `profile.avatar` changes; `refetchSession()` called after save so navbar updates immediately |
| decodeURIComponent for usernames | Profile URLs use `decodeURIComponent(params.username)` to handle spaces and special characters in names |
| Ban system — 3 layout checks | `(public)/layout.tsx`, `dashboard/layout.tsx`, `(admin)/layout.tsx` all check `user.banned` and redirect to `/banned` — no middleware needed |
| Suspended blocked from dashboard/admin | `dashboard/layout.tsx` and `(admin)/layout.tsx` redirect suspended users to `/suspended` |
| Banned page outside (public) group | `/banned` page at `src/app/banned/page.tsx` uses root layout only (no navbar/footer) to avoid redirect loop |
| proxy.ts deleted | Old `proxy.ts` was never imported — dead code. All ban/suspend logic now lives in layout files directly |
| Upload error revert in profile dashboard | Previous avatar/banner values saved on load; on upload failure, state reverts and error message shown |

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
| Vercel Blob store setup | ⚠️ Recommended | Small images (<500KB) now stored as data URIs in DB and persist without Blob; Blob still recommended for large files and zips |
| Migrate existing uploads | ❌ Pending | Files already in `public/uploads/` need manual re-upload; after re-upload, they'll persist via data URI (any size) or Blob |
| Upload progress indicator | ❌ Pending | No progress bar during upload — user sees "Uploading..." text only |
| Ban permanent only | ❌ Pending | Ban currently sets expiry to 2099-12-31; no temporary ban option (suspend covers temp) |

---

## [DEPLOYMENT]

- **Repository:** `github.com/Shadow132245/last-peace-of-art`
- **Hosting:** Vercel (auto-deploy from main branch)
- **Database:** Neon PostgreSQL (serverless)
- **Build command:** `npx prisma generate && next build`
- **Admin user:** Email `fghfghffdgfhfgh@gmail.com` — role set via SQL

---

## [CONVERSATION_LOG]

### Session 13 — Upload Reliability + Navbar Avatar Sync (2026-05-29)

**User reported in Egyptian Arabic:**
> "اما باجي اعمل ابلود لصورة في البروفايل يقولي ابلود فيلد" + "المفروض بعد اما اغير لوجو بروفايلي ميتغيرش في البروفايل بس يتغير في الصورة بتاعت بروفايلي الي في الناف بار"
> (When I upload a profile image it says "Upload failed" + After changing my profile logo, it doesn't change on the profile page but only changes in the navbar avatar)

**Issue 1: Upload failed on Vercel**
- Images >2MB fell through to local filesystem (`uploadLocally`) which calls `writeFile` on `public/uploads/`
- Vercel serverless functions have a **read-only filesystem** — writing to `public/uploads/` throws EROFS error
- The only writable directory is `/tmp`, which is also ephemeral

**Fix applied:**
1. **Removed `isSmallImage()` size limit entirely** — ALL images (any size) use `toDataUri()` when Blob is unavailable. This guarantees profile images always persist as base64 in the database
2. **Blob failure graceful fallback** — if `uploadToBlob()` returns null (instead of crashing to local), now falls back to `toDataUri()` gracefully
3. **Better error response** — catch block now includes `error.message` in the JSON response so the client sees the actual error
4. **Client-side network safety** — wrapped fetch in try/catch; JSON parse with fallback; descriptive error messages

**Issue 2: Navbar avatar didn't update with profile avatar**
- Navbar `AvatarDropdown` used `user.image` from the session (Better Auth User model field)
- Profile dashboard saves the uploaded avatar to `Profile.avatar` only
- These are two different fields — changing one had no effect on the other

**Fix applied:**
1. **`PUT /api/profile` now syncs `User.image`** — when `avatar` field is present in the request body, `prisma.user.update()` sets `image: avatar` on the User model
2. **Client session refresh** — `refetchSession()` called after successful save, so the navbar avatar updates immediately without requiring a full page refresh
3. **Remove flow works too** — when avatar is removed (`avatar: null`), `User.image` is set to null and navbar shows initials

### Session 12 — Ban System Fix + Upload Persistence Fix (2026-05-29)

**User reported in Egyptian Arabic:**
> "البان مش شغال بمعني اصح المفروض لما حد اعملو بان الموقع عنده يقفل نهائي+مشكلة اللوجو والبانر زي ماهي مبتتسيفش"
> (Ban doesn't actually work — when someone is banned, the site should completely close for them. And the logo/banner problem persists — they still don't save.)

**Issue 1: Ban system was completely non-functional**
- The `proxy.ts` file had suspend-redirect logic but was **never imported anywhere** — completely dead code
- No middleware existed to check banned/suspended status
- Banned users could browse the site normally
- Suspended users could access dashboard and admin freely

**Fix applied:**
1. **Created `/banned` page** at `src/app/banned/page.tsx` outside the `(public)` route group to avoid redirect loops — shows "Account Banned" message with Contact Support link
2. **Public layout check** — `(public)/layout.tsx` fetches session via `auth.api.getSession()` and redirects banned users to `/banned` immediately
3. **Dashboard layout check** — `dashboard/layout.tsx` checks both banned (→ `/banned`) and suspended (→ `/suspended`)
4. **Admin layout check** — `(admin)/layout.tsx` (client component) now checks banned and suspended before the admin role check
5. **Deleted `proxy.ts`** — dead code removed

**Issue 2: Profile images (avatar/banner) lost after deploy**
- Images >500KB were saved to `public/uploads/` (ephemeral on Vercel) instead of as data URIs in the DB
- Profile page had no error handling if upload failed — blob URLs would leak into save state

**Fix applied:**
1. **Data URI threshold raised** from 500KB → **2MB** in `upload/route.ts` `isSmallImage()` — most profile images now stored as base64 data URIs in the database
2. **Error handling in profile dashboard** — added `avatarPrev`/`bannerPrev` state to remember previous values; on upload failure, reverts to previous value and displays error message
3. **Error message display** — red error text shown below the upload area when upload fails

### Session 11 — Safe Image Fallbacks (2026-05-29)

**User reported:**
> "برضو مشكلة اللوجو والبنر هي هي مع اني رابط بلوب بفيرسل وبالبروجكت"
> (Logo and banner problem persists even though Blob is linked with Vercel and the project)

**Root cause:**
- Old upload URLs in the database (`/uploads/uuid.jpg`) still point to deleted local files
- Vercel Blob only applies to **new** uploads — existing URLs need to be refreshed by re-uploading
- The user needs to re-upload their avatar and banner from Dashboard → Profile for the new Blob URLs to be saved

**Fix applied:**
- Created `SafeImg` and `SafeBanner` client components in `src/components/ui/safe-image.tsx`
- `SafeImg`: shows initials as fallback when image fails to load (instead of broken image icon)
- `SafeBanner`: hides entirely when image fails to load
- Updated profile page (`user/[username]/page.tsx`) to use these components instead of raw `<img>` tags
- This prevents visual glitches from stale upload URLs while users re-upload their assets

### Session 10 — Live Search Rewrite (2026-05-29)

**User request in Egyptian Arabic:**
> "لما باجي اعمل سيرش المفروض ان الموقع يساعدني انو مثلا اول حرف اكتبه يعرضلي كل الحاجات الي في البوستات والبروجكتات الي بنفس الحرف... ولو طلعلو نفس العنوان يتكتب تحت الشئ الي بيبحث عنو اسم المستخدم وعدد الايكات والديس لايكات والمشاهدات"
> (When I search, the site should show me results as I type the first letter, display posts/projects matching the search, and show username, likes, dislikes, and views under each result to make searching easier)

**What was done:**
1. **Search API rewrite** — switched from PostgreSQL tsvector to Prisma `findMany` with `contains` + `mode: "insensitive"` for cross-language support (Arabic, English). Added forum threads to search results. Each result now includes: `userName`, `userId`, `userImage`, `likesCount`, `dislikesCount`, `views`, `commentCount`
2. **Live search** — single client component with debounced input (200ms). Results appear as you type, no form submit needed
3. **Grouped results** — results organized by type: Posts, Projects, Threads, Users — each with section headers
4. **Rich result cards** — each card shows: type badge (color-coded), title, description excerpt, user avatar+name (clickable link to profile), likes count, dislikes count, views count, comment count (for threads)
5. **Removed old files** — deleted `search-input.tsx` and `search-results.tsx`, consolidated into single `page.tsx`

### Session 9 — Profile Clickable Posts/Projects (2026-05-29)

**User reported in Egyptian Arabic:**
> "لما دخلت علي البروفايل ظهر البوست بتاعي لما بدوس عليه مبيودنيش ليه اني اشوفه بالكامل هو بس مديني التايتل"
> (On the profile page, my posts show — but clicking them doesn't take me to the full content, just shows the title)

**Fix:**
- Wrapped project cards in `<Link href={/projects/[id]}>` with hover border transition
- Wrapped post cards in `<Link href={/blog/[slug]}>` with hover border transition
- Threads were already linked; now all three content types are clickable from the profile page

### Session 8 — Profile 404 Fix v2 + Data URI Fallback (2026-05-29)

**User reported:**
> "برضو لما بدوس فيو بروفايل بيظهر بيج نوت فاوند 404" — View Profile still shows 404 with space in name
> "المفروض ان انا كنت حاطط لوجو وبنر دلوقتي لما بشوف البروفايل لقيت مفيش لا لوجو ولا البنر" — Uploaded logo and banner disappeared from profile after deploy; dimension settings still saved

**Problem 1: Space in URL**
- Username "Hassan Magdy" → `encodeURIComponent` → `Hassan%20Magdy`
- Next.js doesn't always auto-decode params → `params.username` stays `Hassan%20Magdy`
- `findUnique({ where: { name: "Hassan%20Magdy" } })` fails → page shows 404

**Fix:** Added `decodeURIComponent(username)` before querying database. Idempotent: if already decoded, does nothing.

**Problem 2: Uploaded images lost on deploy**
- Old uploads stored in `public/uploads/` — wiped by Vercel on redeploy
- Database still has URLs pointing to deleted files
- Dimension settings (avatarSize, bannerHeight) persisted separately in `social` JSON

**Fix:** Upload API now has 3-tier storage:
1. `BLOB_READ_WRITE_TOKEN` set → Vercel Blob (persistent cloud storage)
2. No token + image < 500KB → base64 data URI stored directly in database
3. No token + large file → local filesystem (fallback)

This ensures profile avatars and banners persist even without external storage setup.

### Session 7 — Navbar Avatar Dropdown + Mobile Menu (2026-05-29)

**User request in Egyptian Arabic:**
> "عايزك تضيف في الناف بار فوق صورة الحساب بتاع المستخدم الي يقدر منها يروح علي بروفايله ويشوفه ويشوف بوستاته او ثريداته او بروجكتاته"
> (Add a user avatar in the navbar that lets them go to their profile, see their posts, threads, and projects)

**Changes made:**
- New `AvatarDropdown` component in navbar: shows user's avatar image (or initial fallback) as a clickable button
- Dropdown menu contains: name + email header, View Profile, Dashboard, My Posts, My Threads, My Projects, Messages, Friends, Settings, Admin (if applicable), Sign Out
- Animated with motion (fade + scale), click-outside-to-close
- Replaced the old "Dashboard" button and separate "Messages"/"Friends"/"Admin" links in desktop nav with the single avatar dropdown + NotificationBell only
- Mobile menu: replaced the simple "Dashboard" link with full set of links: View Profile, Dashboard, My Posts, My Threads, My Projects, Messages, Friends, Settings, Admin, Sign Out
- Added missing `useRef` import and click-outside handling

### Session 6 — Profile 404 + RoleButton Fixes (2026-05-29)

**User reported three issues in Egyptian Arabic:**
> 1. "لما بدوس علي صورة حسابي في البوست بيظهرلي 404 page not found" — clicking username/avatar in posts leads to 404 page
> 2. "في صفحة الادمن في قسم يوزرز انا معايا رول يوزر مش فاوندر" — admin users page shows founder's role as "user"
> 3. "وخيار الفاوندر اصلا مش موجود" — founder option not in dropdown
> 4. "وتصميم الاختيارات وحش جدا ومش متناسق مع الموقع" — role select styling is ugly

**Fixes applied:**
- Profile page: `force-dynamic`, `findUser()` function with exact → case-insensitive fallback so username matching works regardless of casing
- RoleButton: complete rewrite from native `<select>` to custom animated dropdown with:
  - Colored dot per role (amber=founder, purple=admin, emerald=bug_hunter, grey=user)
  - Checkmark on currently selected role
  - Motion animations (scale on click, fade in/out dropdown)
  - Click-outside-to-close
  - Dark mode support
  - "founder" option added to the list
- Server-side guard unchanged: only founder email (`fghfghffdgfhfgh@gmail.com`) can change roles

### Session 5 — Persistent Storage Fix (2026-05-29)

**User's complaint in Egyptian Arabic:**
> "لما بتيجي ترفع اي تحديث للموقع الوجو والبنر بتوع الحساب بيختفو الي انا كنت حاططهم... انا مش عايز اي حاجة بتاعت مستخدمين تضيع"
> (When I deploy updates, the logo and banner images disappear. I don't want any user data to be lost.)

**Problem identified:**
- Files stored on Vercel's ephemeral filesystem in `public/uploads/` are wiped on every deployment.
- All user-uploaded content (avatars, banners, profile images, project media, zip files) relies on this local directory.

**Solution implemented:**
1. Installed `@vercel/blob` — Vercel's native persistent blob storage.
2. Rewrote `POST /api/upload` to upload to Vercel Blob when `BLOB_READ_WRITE_TOKEN` is available.
3. Graceful fallback to local filesystem for development environments.
4. Added `BLOB_READ_WRITE_TOKEN` to `.env.example`.

**To activate:**
- User must go to Vercel Dashboard → Storage → Create Blob Store.
- Add the generated `BLOB_READ_WRITE_TOKEN` to Vercel → Project → Environment Variables.
- Redeploy — all new uploads will persist permanently.

### Session 4 — Full Feature Request (2026-05-29)

The user requested the following features be implemented all at once, and explained in Egyptian Arabic:

1. **رفع ملفات مضغوطة (zip files)** — أي حد يقدر يرفع zip لما يرفع بروجكت أو بوست أو ثريد
2. **نظام Bug Hunter** — يوزر يكتشف مشكلة أو ثغرة، يفتح تicket، التكت يوصل للأدمن، الأدمن يرد ويقدر يدي رتبة bug_hunter من لوحة التحكم، وصاحب الرتبة البوست/البروجكت/الثريد بتاعه ينشر على طول بدون موافقة
3. **البروفايل** — لما تدوس على اسم الناشر في بوست/بروجكت/ثريد، تروح على البروفايل بتاعه، تقدر تبعتله رسالة وتطلبه صديق. ويظهر جنب اسمه صورة الحساب
4. **رتبة Founder** — رتبة صاحب الموقع تكون founder مش admin
5. **نظام التقديم (Staff Application)** — قسم تقديم على إدارة الموقع بأسئلة حلوة، التقديمات تتبعت للأدمن، يقدر يقبل أو يرفض، واليوزر يستلم notification
6. **Notifications** — زرار notification في الموقع للتحديثات والرسائل وطلبات الصداقة

### What was done (Session 4):
- ✅ Upload API: zip files up to 50MB accepted; ImageUpload component handles images + zip
- ✅ Bug hunter auto-approval: posts/projects/threads from bug_hunter users auto-published
- ✅ Bug hunter via tickets: ticket system already existed from Session 3 (user submits → admin panel → admin responds)
- ✅ Role assignment from admin: RoleButton in `/admin/users` existed from Session 3
- ✅ Profile links on blog/projects/forum: existed from Session 3
- ✅ Profile buttons: `/user/[name]` now has "Send Message" + "Add Friend"
- ✅ Founder role: admin layout already checks for both `admin` and `founder` from Session 3
- ✅ Applications: `/apply` page with 6 questions, admin page with accept/reject, notification to user, auto-role on approve
- ✅ Notification bell: existed from Session 3 (30s polling, unread count, all types)
- ✅ Messaging UI: `/dashboard/messages` with conversation sidebar + chat window
- ✅ Friends UI: `/dashboard/friends` with friends list, pending requests, add friend search
- ✅ Navbar: Messages + Friends links added for authenticated users

### Previous context from user:
- The user's role is **founder** (not admin)
- Admin user email: `fghfghffdgfhfgh@gmail.com`
- Repo: `github.com/Shadow132245/last-peace-of-art`
- Hosted on Vercel with Neon PostgreSQL
- User speaks Egyptian Arabic — all future communication should be in Egyptian Arabic
- After every change, push directly to GitHub — never keep changes only locally
- Always read PROJECT_MAP.md first before starting any new task
- Do NOT run `next build` locally (user said "متعملش بيلد للموقع")
