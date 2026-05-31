# PROJECT_MAP — "The Last Peace of Art"

> Generated: 2026-05-31 | Status: **M1✅ M2✅ M3✅ M4✅ M5✅ M6✅ M6.5✅ M7✅ M8✅ M9✅ M10✅ M11✅ M12✅ M13✅ M14✅ M15✅ M16✅ M17✅ M18✅ M19✅ M20✅ M21✅ M22✅ M23✅ M24✅ M25✅ M26✅ M27✅ M28✅ M29✅ M30✅ M31✅ M32✅ M33✅ M34✅ M35✅ M36✅ M37✅ M38✅ M39✅**

---

## [RULES]
- **Always push to GitHub after every change** — never keep changes only locally
- **Always read PROJECT_MAP.md first** before any new task to know where we left off
- **Never ask me what we did before** — just read this file
- **NEVER run `npm run build` or `next build`** — building times out (~8 min) and fails locally; trust Vercel to build on deploy

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
| M25 | Auth enhancements — Remember Me, Email Verification, 2FA/OTP via email; nodemailer integration; TwoFactor model | ✅ |
| M26 | i18n — full Arabic/English bilingual support for all pages, components, and admin panel | ✅ |
| M27 | Bug fixes — I18nProvider SSR guard removed (was breaking useI18n), DATABASE_URL SSL mode fixed, prisma db push for TwoFactor | ✅ |
| M28 | Smooth locale switch animation + hero section translation fix (was hardcoded English) | ✅ |
| M29 | Notification bell RTL fix, dashboard redesign, messages polling | ✅ |
| M30 | 2FA OAuth support + proper TOTP flow (QR code + verify step) | ✅ |
| M31 | Client-side QR generation with qrcode library | ✅ |
| M32 | Seed script with sample user + starter content (projects, posts, threads) | ✅ |
| M33 | Vercel Analytics integration (Speed Insights + Web Analytics) | ✅ |
| M34 | Draft/Publish UX fix + Admin delete error handling | ✅ |
| M35 | Admin approval system + Content moderation (keyword filter) | ✅ |
| M36 | HTML email templates + 2FA flow fix + TOTP/OTP login fix | ✅ |
| M37 | Forgot/Reset password flow + Admin verify-users tool + i18n keys | ✅ |
| M38 | Fix: direct fetch for forgot/reset + per-user verify button + build fix | ✅ |
| M39 | Auto sign-in after verification, ScrollToTop redesign, About page animations + redesign | ✅ |
| M40 | Smoother spring animations across all components + About page translation fix + dashboard/admin UI polish | ✅ |
| M41 | Terms & Privacy full Arabic translation, agree-to-terms on register, custom scrollbar, ScrollToTop glitch fix | ✅ |
| M42 | Google OAuth agree-to-terms, hardcoded date translated, overflow-x-hidden fix, PROJECT_MAP.md recorded SMTP on Vercel | ✅ |
| M43 | Admin verify-users API fixed for founder + Verify button UI polish | ✅ |
| M44 | Dashboard StaggerList fix, wrong i18n keys fixed, locale switch flash fix | ✅ |
| M45 | Ban system rewrite (direct DB check), /banned page redirect on unban, Contact Support email fix | ✅ |
| M46 | Gamification (points/auto-rank), @Mentions, Bookmarks, Polls, Upload Progress Bar, Read Receipts, Rich Embeds | ✅ |

---

## [SESSION_LOG]

### Session 29 — 2026-05-30

1. **Notification bell RTL positioning** — Changed `right-0` → `end-0` and `-right-1` → `-end-1` so the bell dropdown doesn't go off-screen in Arabic (RTL) mode
2. **Real-time chat polling** — Added 3-second polling for messages when a conversation is selected, and 10-second polling for the conversation list. Changed `text-left` → `text-start` for RTL alignment. Messages and conversation list now update automatically
3. **Duplicate editProfile key in i18n JSON** — `"editProfile"` was duplicated as both string (line 150) and object (line 199). JSON parsers took the last value (object), so `t("dashboard.editProfile")` returned an object instead of a string — breaking all dashboard cards. Renamed the string to `"editProfileLabel"` in `en.json` and `ar.json`. Updated dashboard to use `t("dashboard.editProfileLabel")`
4. **Dashboard redesign** — `max-w-5xl` → `max-w-6xl`. Stats grid: `lg:grid-cols-5`. Stats numbers: `text-4xl`. Added `bg-white`/`dark:bg-zinc-900` and hover shadow. Removed duplicate Messages/Friends from quick actions. Removed `FadeInView`/`StaggerList` wrappers. Dedicated `ActionCard` component
5. **allowPasswordless for OAuth 2FA** — Added `allowPasswordless: true` to twoFactor plugin config in `auth.ts`. Password input is now optional. Added `passwordOptional` i18n key
6. **Proper TOTP 2FA flow** — After `enable()`, UI now shows: QR code → secret key → backup codes → 6-digit code input → verify button calling `verifyTotp()`. 2FA only activates after successful TOTP verification. New i18n keys: `setupTitle`, `scanQR`, `manualSetup`, `enterCode`, `verify`, `verifying`, `invalidCode`
7. **Client-side QR generation** — Created `TotpQr` component at `src/components/ui/totp-qr.tsx` using `qrcode` npm package (Canvas-based). Replaced external `api.qrserver.com` API

### Session 37 — 2026-05-30

1. **sendResetPassword callback** — Added `async sendResetPassword({ user, url })` inside `emailAndPassword` in `auth.ts`. Uses the same branded HTML email template design as verification/OTP emails: gradient header, "Reset Password" button, expiry notice (1 hour), fallback URL text
2. **Forgot password page** — `(auth)/forgot-password/page.tsx`: email input + "Send Reset Link" button calling `authClient.forgetPassword({ email, redirectTo: "/reset-password" })`. Shows success message when email sent, error on failure. "Return to sign in" link at bottom
3. **Reset password page** — `(auth)/reset-password/page.tsx`: reads `token` from URL query params. Shows error if token missing. New password + confirm password inputs calling `authClient.resetPassword({ newPassword, token })`. Shows success message with "Return to sign in" link on completion
4. **Forgot password link in login form** — `login-form.tsx`: wrapped Remember Me checkbox and "Forgot password?" link in a flex row (`flex items-center justify-between`). Link points to `/forgot-password`
5. **Admin verify-users API** — `api/admin/verify-users/route.ts`: POST endpoint, checks admin session, runs `prisma.user.updateMany({ where: { emailVerified: false }, data: { emailVerified: true } })`. Returns `{ updated: count }`
6. **Verify All Users button** — `overview-cards.tsx`: added "Verify All Users" button below stat cards. On click, calls POST `/api/admin/verify-users`, shows result ("Verified X users") in green, error in red. Loading state during request
7. **Translation keys** — Added 11 new keys in `en.json` and `ar.json`: `forgotPassword`, `forgotPasswordTitle`, `forgotPasswordDesc`, `sendResetLink`, `resetLinkSent`, `resetPassword`, `resetPasswordTitle`, `resetPasswordDesc`, `newPassword`, `confirmPassword`, `passwordResetSuccess`, `passwordMismatch`, `invalidOrExpiredToken`
8. **All pushed to GitHub** — commit `c14f28e`

### Session 37b — 2026-05-30 (Fix: direct fetch + per-user verify)

1. **Fixed TypeScript error** — `authClient.forgetPassword()` and `authClient.resetPassword()` don't exist in Better Auth v1 client. Changed both pages to use `fetch("/api/auth/request-password-reset", ...)` and `fetch("/api/auth/reset-password", ...)` directly
2. **verify-users API now accepts specific user IDs** — POST body can include `{ userIds: ["id1", "id2"] }` to verify specific users, or call without body to verify all. Filtered to only update `emailVerified: false` users
3. **Per-user Verify button** — Created `verify-button.tsx` client component showing "Verify" link (or "Verified" badge if already done). Added to admin users table actions column next to Ban/Suspend buttons
4. **All pushed to GitHub** — commit `fb44b8b`

### Session 37c — 2026-05-30 (Fix: `"use client"` on Button/Input + SMTP investigation)

1. **Added `"use client"` to Button and Input** — `button.tsx` and `input.tsx` use `forwardRef` but were missing `"use client"` directive. Added it to ensure proper client boundary in SSR
2. **Investigated email-not-sending bug** — Discovered Better Auth v1's `sendResetPassword` callback is wrapped in `runInBackgroundOrAwait()` which **catches all errors** and logs them via `logger.error("Failed to run background task:", e)`, then **always returns 200** (`{ status: true, message: "If this email exists..." }`). This means SMTP failures are silently swallowed and the user always sees "email sent"
3. **Root cause of email not arriving** — SMTP env vars (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASSWORD`, etc.) are missing from Vercel environment variables. The local `.env` has them but they're not deployed to Vercel
4. **Root cause of `useRef` error** — Runtime error `Cannot read properties of null (reading 'useRef')` in `src_components_0q~jzsi._.js` chunk (contains `NotificationBell`, `Navbar`, `PageTransition`, `LocaleSwitcher`, `ScrollToTop`). All have `"use client"`. Likely a Turbopack bundling/optimization issue with `motion` + React 19 on Vercel serverless
5. **All pushed to GitHub** — commit `5359cd6`

### Session 39 — 2026-05-31 (Auto sign-in, ScrollToTop redesign, About page animations)

1. **Auto sign-in after email verification** — Changed `autoSignInAfterVerification: false` → `true` in `emailVerification` config in `auth.ts`. When a user clicks the verification link in their email, they will be automatically signed in instead of being redirected to the login page
2. **ScrollToTop redesign** — Complete rewrite: gradient amber background (`from-amber-500 to-amber-600`), spring animation (`stiffness: 400, damping: 25`), chevron-up SVG icon (no box), hover scale + shadow + slight lift, lower threshold (300px instead of 400), `AnimatePresence` for enter/exit animations
3. **About page redesign + animations** — Each section wrapped in `FadeInView` (delays 0 → 0.6), added owner card with profile placeholder (initial letter in gradient circle), increased padding/spacing, improved semantic HTML. All sections now fade in as user scrolls
4. **Translation verification** — Confirmed `ar.json` `aboutUs` key is correct UTF-8 Arabic. Discovered that server components don't re-render when client changes locale via cookies — requires page refresh. This is expected behavior for server components with cookie-based i18n

### Session 40 — 2026-05-31 (Smoother animations, About page translation fix, UI polish)

1. **About page translation fix** — Converted About page from Server Component (`getServerT()`) to Client Component (`useI18n()`). This fixes the Arabic translation not updating when user switches locale via the LocaleSwitcher — the page now re-renders immediately because `useI18n()` responds to client-side locale changes. Trade-off: metadata (`generateMetadata`) no longer exported (client components can't export metadata)
2. **All animation components updated to spring** — `FadeInView`, `PageTransition`, `StaggerList`/`StaggerItem`, `AnimatedList`/`AnimatedItem`, `AnimateCard` all now use `type: "spring"` with tuned stiffness/damping/mass instead of `duration/ease`. This gives a much smoother, more natural feel:
   - `FadeInView`: spring stiffness 120, damping 20, mass 0.8 (was duration 0.45 easeOut)
   - `PageTransition`: spring stiffness 160, damping 24, mass 0.6 (was duration 0.35 easeOut)
   - `StaggerItem`/`AnimatedItem`: spring stiffness 150-180, damping 22, mass 0.7
   - `AnimateCard`: spring stiffness 180, damping 22, mass 0.7, hover y: -6
3. **Dashboard home page animated** — Added `FadeInView` wrapping the title + stats grid + quick actions heading. Quick actions grid now uses `StaggerList`/`StaggerItem` for staggered entrance. DashboardCard and ActionCard now have hover effects: `-translate-y-1`, amber border/shadow on hover, amber text color on hover
4. **Auth pages (5 pages) updated to spring** — Login, Register, Forgot Password, Reset Password, Verify Email all changed from `duration: 0.4, easeOut` to `spring stiffness: 160, damping: 24, mass: 0.6`
5. **Admin layout updated** — Sidebar animation changed to spring (`stiffness: 140, damping: 22, mass: 0.7`). Main content area animation changed to spring (`stiffness: 160, damping: 24, mass: 0.6, delay: 0.1`). Added `FadeInView` wrapper around `{children}` so all admin sub-pages get scroll-triggered fade-in
6. **globals.css improved** — Global transition reduced from `0.3s` to `0.2s` for faster feel. Added `scaleIn` keyframe animation. Main tag animation reduced from `0.5s` to `0.3s`
7. **NEVER run `npm run build` or `next build`** — Added to RULES section in PROJECT_MAP.md. Building locally times out (~8 min) and fails; Vercel handles builds on deploy
8. **Commit `6420b68`** — Fix About page Arabic translation (convert to Client Component)

### Session 41 — 2026-05-31 (Terms/Privacy Arabic, agree-to-terms, custom scrollbar, ScrollToTop glitch fix)

1. **Terms & Privacy full Arabic translation** — Both pages converted from Server Components (`getServerT()`) to Client Components (`useI18n()`) so they immediately respond to locale switching. All 14 Terms sections and 11 Privacy sections with their titles, content, and bullet lists are now fully translated in `ar.json` with proper Arabic legal text, Arabic-Indic numerals (١٢٣), and culturally appropriate phrasing. English legal text moved from hardcoded JSX to `en.json` translation keys
2. **Agree-to-terms checkbox on registration** — Added a required checkbox in `register-form.tsx` between password and submit button. The label reads "I agree to the [Terms of Service] and [Privacy Policy]" with clickable links to `/terms` and `/privacy`. Submit button is only enabled when checked. Error message shown if user tries to submit without agreeing. Translation keys: `auth.agreeToTerms`, `auth.agreeToTermsAnd`, `auth.agreeToTermsError`, `auth.termsLink`, `auth.privacyLink`
3. **Custom scrollbar styling** — Added `::-webkit-scrollbar` CSS rules in `globals.css` with 8px width, rounded thumb (`#d4d4d8` in light mode, `#3f3f46` in dark mode), transparent track, and hover states. Added Firefox `scrollbar-width: thin` + `scrollbar-color` fallback. The browser scrollbar now matches the site's zinc/neutral color scheme
4. **ScrollToTop glitch fix** — Changed `position: fixed; right-6` to `end-6` (logical property for RTL support). Added `mode="popLayout"` to `AnimatePresence` to prevent layout shift during exit animation. Added explicit `key="scroll-to-top"` for proper React reconciliation. This fixes the duplicate/center-position glitch
5. **NEVER run `npm run build` or `next build`** — Already in RULES section

### Session 42 — 2026-05-31 (Google OAuth agree-to-terms, hardcoded date fix, overflow-x-hidden, SMTP vars on Vercel)

1. **SMTP env vars added to Vercel Dashboard** — All SMTP environment variables (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`) have been added to Vercel Dashboard → Project Settings → Environment Variables. Production email features (verification, password reset, 2FA OTP) should now work on the live site
2. **Google OAuth agree-to-terms** — `register-form.tsx` `handleGoogleLogin` now checks `agreeToTerms` before calling `authClient.signIn.social()`. If the checkbox is unchecked, it shows the same error (`auth.agreeToTermsError`) as email registration. Both registration methods (email + Google) now require terms agreement
3. **Hardcoded English date fixed** — The `May 28, 2026` hardcoded in Terms page and Privacy page `.replace("{date}", ...)` is now replaced with translation key lookups: `t("legal.termsDate")` and `t("legal.privacyDate")`. Added `legal.termsDate` and `legal.privacyDate` to both `en.json` (`"May 28, 2026"`) and `ar.json` (`"٢٨ مايو ٢٠٢٦"`)
4. **Overflow-x-hidden added** — Added `html { overflow-x: hidden; }` to `globals.css` to prevent horizontal scrollbar glitch where the scroll arrow would appear at the bottom of the page due to element overflow
5. **Custom scrollbar updated to amber gradient** — Changed scrollbar thumb from zinc (`#d4d4d8`) to amber gradient (`#f59e0b` → `#d97706`) to match the site's amber theme. Added `background-clip: padding-box` + `border: 2px solid transparent` for rounded edges with transparent gaps. Firefox `scrollbar-color` updated to amber. Dark mode uses same amber gradient with slight opacity
6. **All pushed to GitHub** — commit `042e419`

### Session 43 — 2026-05-31 (Admin verify-users API fix + Verify button UI polish)

1. **verify-users API fixed for founder** — The `/api/admin/verify-users` route had `session.user.role !== "admin"` which blocked founder from verifying users. Changed to use `requireAdmin()` pattern that allows both `admin` and `founder`
2. **Verify button UI polish** — `verify-button.tsx` updated: when verified, shows green "Verified" badge with amber dot and emerald background instead of plain text. Button now properly disabled after successful verification
3. **All pushed to GitHub** — commit `1a5b7c4`

### Session 44 — 2026-05-31 (Dashboard StaggerList fix, wrong i18n keys fixed, locale switch flash fix)

1. **StaggerList chain fixed** — `dashboard/page.tsx` had a plain `<div>` wrapper between `<StaggerList>` and `<StaggerItem>`, breaking the stagger animation chain. Moved the grid className directly onto `<StaggerList>` so staggerChildren propagates correctly to direct `motion` children
2. **Wrong i18n keys fixed** — `posts/new/page.tsx` used `dashboard.createProject.titleLabel/tagsLabel/cancel` instead of `dashboard.createPost.*`. `forum/new/page.tsx` used `dashboard.createProject.*` instead of `dashboard.createThread.*`. Added missing translation keys (`titleLabel`, `tagsLabel`, `cancel`) to both `createPost` and `createThread` in `en.json` and `ar.json`, then updated all code references
3. **Locale switch flash fixed** — Changed `AnimatePresence mode="wait"` to `mode="popLayout"` and removed `exit` animation in `i18n-provider.tsx`. The previous `mode="wait"` caused the entire page to fade out (white flash) before fading in the new locale. Now uses `popLayout` for instant layout swap with a quick fade-in only
4. **All pushed to GitHub** — commit `d70c12a`

### Session 45 — 2026-05-31 (Ban system rewrite, Contact Support fix)

1. **Ban system rewritten** — The layouts (`(public)`, `dashboard`) used `session.user.banned` from Better Auth's getSession(), which returns cached session data. When an admin unbanned a user, the session still had `banned: true` for up to 1 day (updateAge), so the user stayed stuck on /banned. Fix: layouts now fetch the `banned` and `suspended` statuses directly from Prisma via `prisma.user.findUnique()` with the session's user ID, bypassing the session cache entirely
2. **/banned page redirect on unban** — The banned page is now also a redirect guard: it calls `authClient.getSession()` on mount and checks if the user is still banned. If the ban was lifted, it redirects to `/dashboard` instead of staying stuck on the banned page
3. **Contact Support email fixed** — The /banned page had `mailto:support@lastpeace.art` which is a non-existent domain. Changed to the real contact email `fghfghffdgfhfgh@gmail.com` (same as used in Terms/Privacy pages). The button now opens the user's email client with a working address
4. **All pushed to GitHub**

1. **Beautiful HTML email templates** — `auth.ts` email templates redesigned: branded gradient header, responsive layout, styled buttons, clean typography. Both verification email (big "Verify Email" button with fallback link) and OTP email (large monospace code display with expiry notice) now look professional
2. **2FA login flow confirmation step** — Login form now shows a confirmation screen: "Code sent to your email" with an email icon and an OK button before showing the code input. Resend also goes through the confirmation screen
3. **TOTP + OTP verification fix** — `handleVerifyCode` now tries `verifyTotp()` first (for authenticator app users), then falls back to `verifyOtp()` (email code). Fixes the bug where entering a correct TOTP code showed "wrong code" because only `verifyOtp()` was being called
4. **New translation key** — Added `auth.codeSentDesc` in both `en.json` and `ar.json` for the confirmation screen message

### Session 35 — 2026-05-30

1. **Admin approval system** — All content (posts/projects/forum threads) is now created as draft by default (`published: false`). Only admin/founder can publish content via the admin panel's Accept button (`AdminPublishToggle`). Bug Hunter role still auto-publishes but content is scanned by moderation
2. **Content moderation system** — Created `src/lib/moderation.ts` with keyword-based filter (English + Arabic inappropriate words). When Bug Hunter publishes content that matches banned words, a notification is sent to all admins/founders with details of the flagged content
3. **Creation forms cleaned up** — Removed the `published` checkbox from all 3 creation forms (posts/projects/forum). Users create content as draft, admin approves
4. **Admin API routes fixed for founder** — Updated `requireAdmin()` in all admin API routes (posts, projects, threads, reports, appeals) to allow both `admin` and `founder` roles. Previously only checked for `admin`, which blocked the site owner from using admin features
5. **PROJECT_MAP.md updated** — Session 35 entry, M35 milestone

### Session 34 — 2026-05-30

1. **TogglePublish action labels** — `toggle-publish.tsx` now shows the action the user will perform (green "Publish" when currently draft, amber "Unpublish" when currently published) instead of the current state ("Published"/"Draft"). Uses `useI18n()` for translated labels. Color scheme: emerald for publish action, amber for unpublish action
2. **Creation forms draft/publish option** — `dashboard/posts/new/page.tsx`, `dashboard/projects/new/page.tsx`, `dashboard/forum/new/page.tsx` now include a `published` checkbox (default unchecked = draft). `published` value sent in request body
3. **API routes respect `published` field** — `api/posts/route.ts`, `api/projects/route.ts`, `api/forum/route.ts` changed from `published: autoPublish` to `published: published ?? autoPublish` — uses explicit `published` from request body if provided, otherwise falls back to role-based `autoPublish`
4. **Admin DeleteButton checks response** — `delete-button.tsx` now checks `if (!res.ok)`, reads error message from JSON response, and shows `alert()` with the error. Only calls `router.refresh()` on successful deletion
5. **Translation keys added** — `dashboard.publish`, `dashboard.unpublish`, `dashboard.publishCheckLabel`, `admin.delete.error`, `admin.delete.success` in both `en.json` and `ar.json`

### Session 31 — 2026-05-30

1. **Vercel Analytics integrated** — Installed `@vercel/analytics` package, added `<Analytics />` component to root `layout.tsx`. Auto-tracks page views, geolocation, and performance on Vercel via Speed Insights + Web Analytics
2. **PROJECT_MAP.md updated** — Session 31 entry, M33 milestone, critical context for Analytics

### Session 30 — 2026-05-30

1. **Seed script created** — `prisma/seed.ts` with sample content: user "Omar" with avatar (DiceBear), profile, 2 projects (Discord Mod Bot + SWAT 4 Guide), 4 blog posts (Discord dashboard, Vercel uploads behind-the-scenes, TypeScript architecture AR, Audio engineering AR), 5 forum threads (eFootball, VST plugins, Discord bots, Vercel uploads, PC builds)
2. **Prisma config updated** — Added `seed: "npx tsx prisma/seed.ts"` to `prisma.config.ts` migrations config
3. **Seed file syntax fix** — Original file had encoding issues with template literals; rewrote with plain strings
4. **Avatar URLs added** — User and profile now have DiceBear avatar SVG URLs
5. **Seed pushed to GitHub** — commit `17d76ad`

### Session 25 — 2026-05-29

1. **Email utility created** — `src/lib/email.ts`: nodemailer transport configured via SMTP env vars (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`)
2. **auth.ts updated** — session `expiresIn: 30 days` + `updateAge: 1 day` (remember me); `emailVerification` with `sendVerificationEmail` callback + `sendOnSignUp: true` + `autoSignInAfterVerification: false`; `requireEmailVerification: true` in `emailAndPassword`; `twoFactor` plugin with `otpOptions.sendOTP` callback sending codes via nodemailer
3. **auth-client.ts updated** — added `twoFactorClient()` plugin
4. **Login form updated** — "Remember me" checkbox (default checked); 2FA flow: when sign-in response has `twoFactorRedirect`, auto-sends OTP and shows verification code input; resend button
5. **Register form updated** — redirects to `/verify-email` after signup instead of `/dashboard` (since email must be verified first)
6. **Verify-email page created** — `(auth)/verify-email/page.tsx` with "Check your email" message + "Return to sign in" link
7. **Prisma schema updated** — added `TwoFactor` model (id, secret, backupCodes, userId @unique, verified) with `@@map("two_factor")`; added `twoFactorEnabled` boolean to User model; added `twoFactor` relation on User
8. **.env.example updated** — added SMTP env vars
9. **Prisma generate** — client successfully generated with new TwoFactor model

### Session 27 — 2026-05-29 (Bug Fixes + Resend Email + 2FA Toggle)

1. **I18nProvider SSR crash fix** — `I18nProvider` had a `!mounted` guard that returned children WITHOUT `I18nContext.Provider` during SSR. Any client component calling `useI18n()` during server rendering would throw `useI18n must be used within I18nProvider`. This also caused cascading errors (`Cannot read properties of null (reading 'useRef')`) because motion components couldn't render after the context error. Fix: always render the provider wrapper, even on the server.
2. **DATABASE_URL SSL mode fixed** — Changed `sslmode=require` to `sslmode=verify-full` to silence the pg SSL deprecation warning and use the stronger security mode.
3. **Prisma db push** — Ran `npx prisma generate && npx prisma db push` to ensure the `TwoFactor` model table exists in the database (fixes Better Auth `Failed to query fallback join for model user`).
4. **SMTP credentials set in .env** — Gmail App Password configured for sending verification emails and 2FA OTPs.
5. **Resend verification email** — Added email input + resend button in verify-email page; register form now passes email as query param so it's pre-filled.
6. **2FA toggle in Settings** — Settings page now has enable/disable toggle with password confirmation + backup codes display.
7. **auth.ts** — Added `BETTER_AUTH_URL` production URL (`https://lastpeace.vercel.app`).
8. **All pushed to GitHub** — commit `1b47fbf`

### Session 28 — 2026-05-29 (Smooth Locale Switch + Hero Translation Fix)

1. **Hero section translation fix** — `hero-section.tsx` had hardcoded English text ("Your space to create, share, connect" + subtitle). Replaced with `t("landing.heroTitle")`, `t("landing.heroTitleHighlight")`, `t("landing.heroSubtitle")`. Updated `en.json` and `ar.json` with new keys.
2. **Smooth locale transition** — `I18nProvider` now wraps children with `AnimatePresence` + `motion.div` keyed by locale. When switching language, page fades + slides in direction of locale (RTL → LTR).
3. **Build fix** — Removed `authClient.twoFactor.getBackupCodes()` call (not available in Better Auth client API). Backup codes only shown when returned from `enable()` response.
4. **All pushed to GitHub** — commits `bbf3004` + `3aa1415`

### Session 26 — 2026-05-29 (i18n Completion)

1. **i18n infrastructure** — `src/lib/i18n.ts` (lookup, locale cookie), `src/lib/server-i18n.ts` (getServerT for server components), `src/providers/i18n-provider.tsx` (useI18n hook, RTL dir), `src/components/ui/locale-switcher.tsx` (toggle button), `messages/en.json` and `messages/ar.json` (full translation files)
2. **Root layout** — changed `lang` attribute from hardcoded `"en"` to dynamic based on locale cookie
3. **Navbar fully translated** — all nav links, mobile menu, AvatarDropdown labels, Sign In/Out, aria-labels via `useI18n()`
4. **Auth forms translated** — LoginForm, RegisterForm, verify-email page all use `useI18n()`
5. **Public pages translated** — blog, projects, forum (list + detail + pagination), search, user profile, suspended, appeal, banned, 404, privacy, terms
6. **Shared components translated** — comment-section, report-button (form + reasons + states), friend-button, pagination (label props)
7. **Landing page translated** — HeroSection, FeaturesSection (all 4 feature cards), CtaSection
8. **Dashboard pages translated** — home, settings, friends (tabs + search + actions), messages (chat + conversations), profile (avatar/banner/bio/skills + live preview), posts/projects/forum lists + creation forms
9. **Apply & Tickets pages translated** — staff application form (6 questions + labels + states), bug report/vulnerability form (categories + labels + states)
10. **Admin panel fully translated** — overview cards, users/posts/projects/threads/reports/appeals/applications/tickets table headers + status badges + empty states + action labels
11. **Syntax fixes** — navbar.tsx (missing `>` on button), appeal/page.tsx (extra braces), dashboard/layout.tsx (duplicate content block removed)
12. **All pushed to GitHub** — commit `c41b7d9`

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
       ├── Google ──→ Better Auth Google Provider ──→ Dashboard
       └── Email ────→ Better Auth Credentials
              │
              ├── Remember Me = true  ──→ Session expires in 30 days
              ├── Remember Me = false ──→ Session expires in 1 day
              │
              ├── 2FA enabled? ──→ Send OTP email ──→ Verify OTP ──→ Dashboard
              │
              ├── Email not verified? ──→ Sign-in blocked (requireEmailVerification)
              │       │
              │       └── Forgot password? ──→ /forgot-password ──→ Send reset email ──→ Click link ──→ /reset-password?token=xxx ──→ Set new password ──→ /login
              │
              ├── Forgot password? link ──→ /forgot-password ──→ Enter email → sendResetPassword callback ──→ Email with reset link
              │                                           └── Success: "Reset link sent! Check your email."
              │
              └── Sign up ──→ Send verification email ──→ /verify-email page ──→ Click link → email verified
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
│   ├── (auth)/                   # Login / Register / Verify email / Forgot password / Reset password
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
│   │   ├── admin/verify-users/   # POST — fix emailVerified for all users (admin only)
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
│   ├── auth/                     # LoginForm (remember me + 2FA OTP + forgot password link), RegisterForm
│   ├── comments/                 # CommentSection (shared b/w blog/projects/forum)
│   ├── likes/                    # LikeButton (optimistic UI, SVG icons)
│   ├── reports/                  # ReportButton (modal with reason + description)
│   ├── views/                    # ViewTracker (client component, POST on mount)
│   ├── friends/                  # FriendButton (add friend, sent state, loading)
│   └── ui/safe-image.tsx         # SafeImg / SafeBanner — graceful fallback for broken image URLs
├── lib/
│   ├── auth.ts                   # Better Auth server config (Google + Email + forgot/reset password email template)
│   ├── auth-client.ts            # Better Auth client (browser, twoFactorClient plugin)
│   ├── email.ts                  # nodemailer transport (verification, OTP, password reset, sendResetPassword)
│   ├── db.ts                     # PrismaClient singleton (PrismaPg adapter)
│   ├── logger.ts                 # pino logger
│   ├── admin.ts                  # requireAdmin() helper
│   ├── pagination.ts            # parsePagination, buildPaginationMeta, getSkipTake
│   ├── i18n.ts                  # Locale helpers: lookup(), getLocaleFromCookie(), setLocaleCookie()
│   └── server-i18n.ts           # getServerT() for server component translations
├── providers/
│   └── i18n-provider.tsx         # I18nProvider (client context), useI18n hook, RTL dir
├── messages/
│   ├── en.json                   # English translations
│   └── ar.json                   # Arabic translations
├── prisma/
│   └── schema.prisma             # 14 models (+ Appeal, suspended fields on User)
├── prisma.config.ts              # Prisma v7 datasource config
└── generated/prisma/             # Generated Prisma client
```

### Schema (Prisma) — Core Entities (20 models)
```
User          → id, name (unique), email, role, banned, banReason, banExpires, suspended, suspendedAt, suspendedUntil, suspensionReason, twoFactorEnabled
TwoFactor     → id, secret, backupCodes, userId (unique), verified
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
| Better Auth `sendResetPassword` error handling | Better Auth v1 wraps `sendResetPassword` callback in `runInBackgroundOrAwait()` which catches ALL errors and logs them, then ALWAYS returns 200 with `{ status: true }`. SMTP failures are silently swallowed. User always sees "email sent" even when email was never queued |
| `useRef` error in SSR chunk | `Cannot read properties of null (reading 'useRef')` from `src_components_0q~jzsi` chunk on Vercel. Contains `NotificationBell`, `Navbar`, `PageTransition`, `LocaleSwitcher`, `ScrollToTop`. All have `"use client"`. Likely Turbopack bundling issue with `motion` + React 19. Add SMTP env vars to Vercel Dashboard to fix email |
| SMTP on Vercel | Local `.env` has SMTP config but Vercel env vars are missing. Must add `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM` to Vercel Dashboard → Environment Variables |
| Upload error revert in profile dashboard | Previous avatar/banner values saved on load; on upload failure, state reverts and error message shown |
| i18n — two translation mechanisms | Server components: `getServerT()` reads locale cookie + loads JSON. Client components: `useI18n()` from `I18nProvider` context |
| i18n — key lookup | `lookup(obj, "a.b.c")` tokenizes by dot and traverses nested objects; returns key itself if not found |
| i18n — RTL support | `I18nProvider` sets `dir="rtl"` on a wrapper div when locale is `"ar"`; root layout sets `lang` attribute dynamically |
| i18n — placeholder replacement | Messages use `{count}`, `{name}`, `{key}` placeholders; usage: `.replace("{key}", value)` |
| i18n — locale persistence | Cookie `locale` (path=/, max-age=1yr) — set by `LocaleSwitcher` on the client, read by `getServerT()` on the server |
| i18n — Privacy/Terms legal content | Legal text body kept in English (not translated); only page title/h1 and "Last updated" are translated |
| i18n — I18nProvider SSR guard removed | Provider always renders `I18nContext.Provider` wrapper even before hydration (`!mounted`). On SSR the locale defaults to `"en"`, then `useEffect` updates it client-side. Previously the `!mounted` guard returned children without context, causing `useI18n()` to throw during server rendering |
| Do NOT run `next build` locally | Build takes ~8 minutes and times out in CLI; trust that `Compiled successfully` means no errors |
| 2FA — TOTP requires verification step | `twoFactor.enable()` returns `totpURI` + `backupCodes` but does NOT activate 2FA. User must scan QR code with authenticator app, enter 6-digit code, and call `verifyTotp()` for 2FA to become active |
| 2FA — OAuth users (Google) | `allowPasswordless: true` in twoFactor plugin config allows Google sign-in users to enable/disable 2FA without a password. Password field is optional in UI |
| QR code generation | `TotpQr` component at `src/components/ui/totp-qr.tsx` uses the `qrcode` npm package to render QR codes to Canvas — no external API dependency |
| Dashboard grid — 5 stats cards | `lg:grid-cols-5` so all 5 cards (projects/posts/discussions/messages/friends) fit on one row on large screens |
| Quick actions — no duplicates | Messages and Friends quick action links removed since they're already in the stats grid |
| Vercel Analytics | `<Analytics />` component from `@vercel/analytics/react` added to root layout — tracks page views, geolocation, and performance automatically on Vercel |
| TogglePublish action labels | Button shows the action the user will perform ("Publish" meaning "click to publish", "Unpublish" meaning "click to unpublish"), not the current state — solves the "Draft button publishes" confusion. Green for publish, amber for unpublish |
| Creation forms draft checkbox | `published` checkbox (default unchecked = draft) added to posts/projects/forum creation forms; value sent as `published: boolean` in POST body |
| API routes respect explicit `published` | Routes use `published: published ?? autoPublish` — explicit `published` from client request body takes priority over role-based `autoPublish` logic |
| DeleteButton error handling | `fetch` response checked with `if (!res.ok)`, error message shown via `alert()`, `router.refresh()` only called on success |
| Admin approval required | All content (posts/projects/forum) created as draft by default (`published: false`). Only admin/founder can publish via admin panel `Accept` button. Bug Hunter auto-publishes but content is scanned |
| Moderation system | `src/lib/moderation.ts` — keyword-based filter with English + Arabic banned words. `checkContent()` returns `{ flagged, matches }`. `notifyAdmins()` creates notifications for all admin/founder users |
| Bug Hunter moderation | Bug Hunter content is auto-published but scanned by `checkContent()`. If flagged, admins receive notification with details and link to admin panel |
| Admin API routes founder fix | All admin API routes (`requireAdmin()`) now check for both `admin` and `founder` roles using `["admin", "founder"].includes()` |
| HTML email templates | Both emails (verification + OTP) use branded responsive HTML templates with gradient header, styled buttons, monospace code display, and fallback text links |
| 2FA login flow | Login form: after `twoFactorRedirect` → auto-send OTP → confirmation screen ("Code sent to your email") with OK button → code input. Resend also shows confirmation |
| TOTP + OTP fallback in login | `handleVerifyCode()` tries `verifyTotp()` first (authenticator app), falls back to `verifyOtp()` (email). Fixes "correct TOTP code shows wrong" bug |
| `auth.codeSentDesc` | New translation key for the 2FA confirmation screen message in both `en.json` and `ar.json` |
| Forgot/Reset password flow | `sendResetPassword` callback in `emailAndPassword` sends HTML email with "Reset Password" button; `forgetPassword()` client method triggers email; `resetPassword()` verifies token + updates password; `redirectTo: "/reset-password"` sets the URL in the email |
| `authClient.forgetPassword()` | Built-in Better Auth v1 client method — no extra plugin needed. Usage: `authClient.forgetPassword({ email, redirectTo: "/reset-password" })` |
| `authClient.resetPassword()` | Built-in Better Auth v1 client method. Usage: `authClient.resetPassword({ newPassword, token })` where `token` comes from URL query param |
| Admin verify-users API | `POST /api/admin/verify-users` checks admin session, sets `emailVerified: true` for all users where `emailVerified: false`. "Verify All Users" button in admin overview page below stat cards |
| `requireEmailVerification` breaks old users | Users who registered before `requireEmailVerification: true` was enabled have `emailVerified: false` and can't sign in. Use "Verify All Users" button in admin, or use forgot password flow (which doesn't check email verification) |

---

## [ORPHANS & PENDING]

| Item | Status | Notes |
|------|--------|-------|
| Google OAuth live credentials | ❌ Pending | Need to set AUTH_GOOGLE_ID + AUTH_GOOGLE_SECRET in Vercel |
| Deployed site testing | ❌ Pending | Verify all features end-to-end |
| Read receipts for messages | ❌ Pending | Mark messages as read when opened |
| WebSocket for real-time chat | ❌ Pending | Currently uses REST + manual refresh |
| Vercel Blob store setup | ⚠️ Recommended | Small images (<500KB) now stored as data URIs in DB and persist without Blob; Blob still recommended for large files and zips |
| Migrate existing uploads | ❌ Pending | Files already in `public/uploads/` need manual re-upload; after re-upload, they'll persist via data URI (any size) or Blob |
| Upload progress indicator | ❌ Pending | No progress bar during upload — user sees "Uploading..." text only |
| Vercel Analytics (Speed Insights + Web Analytics) | ✅ Done | `@vercel/analytics` installed + `<Analytics />` added to root `layout.tsx` — auto-tracks page views on Vercel |
| Ban permanent only | ❌ Pending | Ban currently sets expiry to 2099-12-31; no temporary ban option (suspend covers temp) |
| Landing page metadata i18n | ❌ Skipped | Metadata (`title`/`description`) stays static English; sub-components already use `useI18n()` |
| Login/Register page wrappers | ❌ Skipped | Page.tsx files are thin wrappers; the actual forms already use `useI18n()` |
| WebSocket for real-time chat | ❌ Skipped | Currently uses REST polling (3s messages, 10s conversations). Adequate for now |

---

## [DEPLOYMENT]

- **Repository:** `github.com/Shadow132245/last-peace-of-art`
- **Hosting:** Vercel (auto-deploy from main branch)
- **Database:** Neon PostgreSQL (serverless)
- **Build command:** `npx prisma generate && next build`
- **Admin user:** Email `fghfghffdgfhfgh@gmail.com` — role set via SQL
- **Do NOT run `next build` locally** — takes ~8 minutes and times out in CLI. Trust that `Compiled successfully` = no errors. Let Vercel handle builds.

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

### Session 27-28 — Email Verification + 2FA + Smooth Locale Switch (2026-05-29)

**User asked in Egyptian Arabic:**
> "المفروض انا نظام التحقق بتاع الايميل والتوفكتور مش شغال ازاي اشغله اديني خطوات"
> (Email verification and 2FA aren't working. Give me steps to set it up.)

**Discovery:**
- Code was fully set up (Better Auth's `emailVerification` plugin + `twoFactor` OTP plugin + `nodemailer` + login/register forms), but SMTP env vars (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`) were MISSING from `.env`
- 3 runtime errors on Vercel: (1) `useI18n must be used within I18nProvider` — I18nProvider SSR guard returned children without context provider; (2) cascade `useRef` null error; (3) Better Auth `Failed to query fallback join for model user` — TwoFactor table didn't exist in DB
- No "Resend verification email" button on verify-email page
- No 2FA enable/disable toggle in Settings page

**Fixes:**
1. I18nProvider: removed `!mounted` SSR guard — always renders `I18nContext.Provider`
2. `.env`: changed `sslmode=require` → `sslmode=verify-full`
3. `npx prisma db push` — created TwoFactor table in Neon DB
4. `.env`: added SMTP credentials (Gmail App Password from user: `fghfghffdgfhfgh@gmail.com`)
5. User added SMTP env vars + `BETTER_AUTH_URL` in Vercel Dashboard (Production only, sensitive)

**User chose Gmail App Password after rejecting SendGrid (الموقع ده بايظ) and Mailgun wasn't tried:**
- Activated 2-Step Verification on Google account
- Created App Password (`qmim ibrp lpwe fneo`) from `https://myaccount.google.com/apppasswords`

**New features implemented:**
1. **Resend verification email button** — verify-email page now has email input + "Resend verification email" button calling `authClient.sendVerificationEmail()`. Register form passes email as query param (`/verify-email?email=...`)
2. **2FA toggle in Settings** — Settings page shows current 2FA status, enable/disable with password confirmation, backup codes displayed on first enable (returned from `authClient.twoFactor.enable()`). Removed `getBackupCodes()` call (not in Better Auth client API — build error fix)
3. **Smooth locale switch** — I18nProvider wraps children in `AnimatePresence` + `motion.div` keyed by locale: fade + slide animation when switching language
4. **Hero section translation fix** — hero-section.tsx had hardcoded English text ("Your space to create, share, connect" + subtitle). Replaced with `t("landing.heroTitle")`, `t("landing.heroTitleHighlight")`, `t("landing.heroSubtitle")`. Updated `en.json` and `ar.json` with new keys

**Committs:**
- `1b47fbf` — Fix I18nProvider SSR crash, SSL mode, prisma db push
- `7d84f98` — Add resend verification email button + 2FA toggle in settings
- `bbf3004` — Smooth locale switch animation + fix hero section translation
- `3aa1415` — Fix: remove getBackupCodes (not in Better Auth API)

**User preferences established:**
- Prefers step-by-step instructions in Egyptian Arabic
- Sensitive env vars go in Vercel Dashboard (Production only), never in committed files
- Trusts Vercel build over local `next build` (local times out)

### Session 37 — Forgot/Reset Password + Admin Verify Users (2026-05-30)

**User reported in Egyptian Arabic:**
> "صاحبي كان مسجل بالحساب ده 13mazloum37@gmail.com في الموقع وواخد رتبة ادمن فا لما جه يسجل دخول تاني لحسابه قاله انو الايميل نوت فيرفايد ازاي ولما حتي جه يستعمل نفس الايميل في التسجيل بجوجل قال الموقع ان الايميل مش مربوط بحساب+ عايز في صفحة تسجيل الدخول يبقا في زر نسيت كلمة المرور ويظهرله انه يكتب الايميل بتاعه عشان يتبعتله عليه لينك لاعادة تعيين الباسورد الخاص بحسابه"
> (My friend was registered as admin with email 13mazloum37@gmail.com. When he tried to log in again, it said email not verified. Also when he tried to sign in with Google using the same email, it said the email is not linked to an account. I want a "Forgot Password" button on the login page.)

**Problem:**
1. `requireEmailVerification: true` was enabled after the friend's account was created → all existing users have `emailVerified: false` and can't sign in
2. Google Sign-In creates a NEW account linked to Google account ID, not by email match — using the same email via Google doesn't link to the existing email/password account
3. No forgot password flow existed in the app — users couldn't reset their passwords

**Solution:**
1. Added `sendResetPassword` callback in `auth.ts` → branded HTML email with "Reset Password" button
2. Created `(auth)/forgot-password/page.tsx` → email input, calls `authClient.forgetPassword()`
3. Created `(auth)/reset-password/page.tsx` → reads token from URL, new password + confirm, calls `authClient.resetPassword()`
4. Added "Forgot password?" link in `login-form.tsx` → flex row with Remember Me checkbox
5. Created `POST /api/admin/verify-users/route.ts` → sets `emailVerified: true` for all users
6. Added "Verify All Users" button in admin overview page
7. Added 13 new translation keys in `en.json` and `ar.json`

**Commit:** `c14f28e` — Add forgot/reset password flow with email template, admin verify-users tool, and translation keys
