# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Layout

Two independent apps in one repo (no root workspace; each has its own `package.json` and lockfiles):

- `backend/` — Strapi 5 CMS (JavaScript) with the GraphQL, users-permissions and CKEditor plugins. Node `>=18 <=22`.
- `frontend/` — Next.js 14 App Router site (TypeScript/JS mix, Sass modules, GSAP).

The root `package.json` only holds stray deps (`jsonwebtoken`); ignore it.

Root-level docs worth knowing about: `QA-REPORT.md` (bug list `BUG-nn`, test cases `TC-nn`, what is fixed vs still open) and `HARDCODED-CONTENT.md` (checklist of frontend strings/values that should move into Strapi, with file:line pointers).

## Commands

Run from inside `backend/` or `frontend/`.

- Backend: `npm run develop` (autoReload, admin at `/admin`), `npm run build` (admin panel), `npm run start`, `npm run console`
- Frontend: `npm run dev`, `npm run build`, `npm run start`, `npm run lint`
- Local seed data: stop Strapi, then `node backend/scripts/seed-local.js` (sqlite is single-writer). It loads minimal content, public read permissions, a throw-away admin and the subscribe/booking/contact API tokens, and prints `STRAPI_SUBSCRIBE_TOKEN`, `STRAPI_BOOKING_TOKEN` and `STRAPI_CONTACT_TOKEN` lines for the frontend `.env`. It is a no-op if a preacher already exists.
- Copy live content locally: stop Strapi, then `node backend/scripts/import-live.js [remoteBase]` (default `http://195.35.56.144/cms`). It reads only the public REST API, replaces local entries of every type except subscriber/booking/contact-message, and re-uploads media. Run the seed first so the API tokens exist.
- Fictional sample readers/healers, articles and testimonials for local testing: stop Strapi, then `node backend/scripts/add-sample-content.js` (idempotent; never for the live site).

### E2E tests (Playwright, frontend only)

- Run all: `npm run test:e2e`. One test: `npx playwright test e2e/auth.spec.ts -g "TC-22" --project=desktop`. Projects are `desktop` and `mobile` (Pixel 7).
- `playwright.config.ts` has no `webServer`: start Strapi and `npm run dev` yourself first. Targets `E2E_BASE_URL` (default `http://localhost:3000`) and `E2E_STRAPI_URL` (default `http://localhost:1337`). Write tests create real subscribers, so don't point them at the live server.
- Tests tagged `[BUG-nn]` assert the *correct* behaviour, so one that fails usually means the bug is still open (see `QA-REPORT.md`), not that the suite is broken.
- `frontend/playwright-report/` and `frontend/test-results/` are committed to git, so a test run leaves them modified.

## Architecture

**Data flow:** Strapi holds all content (pages, blog, preachers/readers, services, testimonials, horoscope, header/footer). The frontend reads it via GraphQL, server-side.

- Frontend GraphQL queries are plain template strings in `frontend/src/queries/*.js`, one per page/entity. They are executed with `fetchStrapi({ query, key })` from `frontend/src/utils/strapi.js`, which POSTs to `${NEXT_PUBLIC_LANDING_URL}/graphql`, and returns `json.data[key] ?? {}`, so `key` must match the root field name in the query.
- `fetchStrapi` uses `cache: "no-store"`, so every route is dynamic (`ƒ` in `next build`). Its `catch` must rethrow errors with `digest === "DYNAMIC_SERVER_USAGE"`: that is how Next marks a no-store page dynamic at build time, and swallowing it makes the build prerender pages with `{}` and crash on `.map`.
- `backend/config/plugins.js` raises the GraphQL `defaultLimit` to 100 (Strapi's default of 10 silently truncated lists and nested relations).
- Reader/healer pills come from the `tagList` relation (Tag collection), read through `tagNames()` in `utils/strapi.js`, which falls back to the legacy comma-separated `tags` text. On startup `backend/src/bootstrap/preacher-tags.js` converts that text for any preacher without tags and grants public read on Tag. Filtering is `/readers?tag=A&tag=B#readers` (readers with ALL tags): the page fetches readers with ANY of them and narrows in code, because Strapi can't AND several conditions on one manyToMany relation. Pills build links with `useTagHref()` (adds to the current filters on /readers) and the sticky `TagFilter` bar holds removable pills and "Clear filters".
- A reader's facts on their page (Abilities, Tools, ...) are the repeatable `details` list (`preachers.detail`: `label` + `description`), so each reader picks their own labels. The old fixed `abilities`/`tools`/`style`/`topics` text fields are kept only with `visible: false`: on every start `backend/src/bootstrap/preacher-details.js` moves any text still in them into `details` and clears them (Strapi drops a removed attribute's column before bootstrap can read it). Don't read or write those four fields; once every database has been converted they can be deleted from the schema.
- Readers ↔ services is manyToMany. A service page's preachers section shows the service's assigned practitioners, falling back to the section's own picks.
- Listing pages (Readers, Testimonials, Home) render curated dynamic-zone sections whose relations an editor fills, not every entry, so a new reader or testimonial only appears there once added to the section.
- `fetchStrapi` never throws: on HTTP errors, GraphQL errors (`data: null`) or network failures it logs and returns `{}`. Callers that expect a list must wrap the result in `asList()` (same file) and call `notFound()` on empty results, as the slug pages do.
- Any route param interpolated into a query must go through `gql(value)` (same file), which JSON-escapes it into a string literal. Never interpolate raw params.
- `next.config.mjs` rewrites `/graphql` to `STRAPI_GRAPHQL_URL`. This is why `NEXT_PUBLIC_LANDING_URL` points at the frontend origin rather than Strapi. It also sets security headers (no CSP yet), a permanent redirect `/resources/horoscope` to `/resources/horoscope/Aries`, and a temporary redirect `/resources` to `/resources/blog` (that menu item has no page of its own).
- Adding a content type: create it in `backend/src/api/<name>/` (content-types, controllers, routes, services) and add a matching query file in `frontend/src/queries/`. Reusable Strapi components live in `backend/src/components/{blogs,preachers,services,ui}`.
- Every current content type has `draftAndPublish: false`, so don't add `status`/`publishedAt` filters.

**Non-GraphQL paths (REST + auth):** all server-side, using Strapi API tokens against `NEXT_PUBLIC_STRAPI_URL`.

- Each form has a Next route in `frontend/src/app/api/` that validates input and POSTs to a Strapi collection type with its own create-only token: newsletter `subscribe/` → `/api/subscribers` (`STRAPI_SUBSCRIBE_TOKEN`), contact `contact/` → `/api/contact-messages` (`STRAPI_CONTACT_TOKEN`), booking `booking/` → `/api/bookings` (`STRAPI_BOOKING_TOKEN`). Follow this pattern for new forms. Note `contact` (no `-message`) is a singleType holding the Contact page layout; singleTypes can't be REST-created.
- Booking time slots are per reader: the repeatable `timeSlots` component (`preachers.time-slot`, `start`/`end` time fields) on the preacher. The Strapi controller turns them into labels like `10:00am - 10:30am`, sorted by start, and that label is what the form shows and what a booking stores in `timeSlot`. The form gets them from `GET /api/booking/availability?reader=<slug>&date=YYYY-MM-DD` (Next, via `utils/bookingAvailability.ts`), which proxies the public custom Strapi route `GET /api/bookings/availability` (`backend/src/api/booking/{routes/01-custom-booking.js,controllers/booking.js}`). That route returns `{ slots, taken }` (labels only, never booking details); `taken` covers bookings that aren't `cancelled`. Taken slots are greyed out, and the POST route rejects a taken (409) or unknown slot. It's a check, not a lock: two submits at the same instant can both get through. `backend/src/bootstrap/booking-slots.js` gave existing readers the old three default slots once (flag in `strapi.store`), so a reader whose slots are cleared later shows "No time slots".
- The `booking` content type has an `afterCreate` lifecycle (`backend/src/api/booking/content-types/booking/lifecycles.js`) that emails `BOOKING_ADMIN_EMAIL` and the reader (`preacher.email`, a private field) via SMTP. If `SMTP_HOST` is unset it logs a warning and skips, so locally bookings save without email.
- Auth is custom, on the Strapi `subscriber` content type, not the users-permissions plugin. Signup (`auth/signup/action.ts`) validates input, hashes the password with scrypt (`<salt>:<hex hash>`) inside Next and creates the subscriber. Login (`auth/login/action.ts`) posts to the custom Strapi route `POST /api/subscribers/login` (`backend/src/api/subscriber/{routes/01-custom-subscriber.js,controllers/subscriber.js}`), which does the constant-time compare because `password` is a private field that never leaves Strapi. The token in `STRAPI_SUBSCRIBE_TOKEN` needs the `subscriber.login` permission.
- Session (`frontend/src/utils/session.ts`): on success Next signs an HS256 JWT `{id}` with `JWT_SECRET` (a frontend env var) and stores it in an `httpOnly` `auth` cookie, 7-day expiry (`secure` only if `COOKIE_SECURE=true`, because the site can be served over plain HTTP). `getSessionUserId()` verifies it; the header uses it to look up the user, so the layout is dynamic. Logout is POST-only.
- `frontend/src/middleware.ts` rate-limits POSTs to `/auth/login` and `/auth/signup` (the Server Action submissions) in memory, 20/min per IP+path. It only runs when `NODE_ENV=production`, so dev and the e2e suite are never throttled.
- reCAPTCHA is currently disabled: the widget and the server-side `siteverify` calls in both auth actions are commented out.
- CMS text arrives in two shapes. Markdown fields go through `<CmsMarkdown>` (`app/components/CmsMarkdown.tsx`, react-markdown, opens external links in a new tab). HTML rich text (CKEditor) is rendered with `dangerouslySetInnerHTML`; pass it through `clean()` from `frontend/src/utils/sanitize.ts` (DOMPurify) first.

**Frontend structure:** `frontend/src/app/` holds routes (`readers/[slug]`, `services`, `resources`, `testimonials`, `about`, `contact`, `auth`) and shared UI in `app/components/`. The reader booking modal state is shared via `src/contexts/readerModal.ts`. `app/components/main.tsx` mounts two global client components: `SmoothScroll` (Lenis wheel easing driven by the GSAP ticker so ScrollTrigger stays in sync; off under `prefers-reduced-motion`) and `Parallax`, which animates any element with `data-parallax="<strength>"` (fraction of viewport height, negative reverses; desktop ≥1080px only, re-run on route change). To add parallax, set the attribute; don't write a new ScrollTrigger. Path alias `@/*` maps to `frontend/src/*`.

## Config notes

- Frontend env: copy `frontend/.env.example` (commented) to `frontend/.env` (gitignored). Vars: `NEXT_PUBLIC_STRAPI_URL`, `STRAPI_GRAPHQL_URL`, `NEXT_PUBLIC_LANDING_URL`, `STRAPI_SUBSCRIBE_TOKEN`, `STRAPI_CONTACT_TOKEN`, `STRAPI_BOOKING_TOKEN`, `JWT_SECRET`, `COOKIE_SECURE`, `NEXT_PUBLIC_CAPTCHA_SITE_KEY`, `CAPTCHA_SECRET_KEY`. Backend env: see `backend/.env.example` (Strapi secrets, DB, and the `SMTP_*`/`BOOKING_ADMIN_EMAIL` booking-email settings).
- `backend/config/database.js` selects the DB via `DATABASE_CLIENT` (default `sqlite`; `postgres` uses the installed `pg` driver). The local sqlite `data.db` and `public/uploads` are gitignored.
- `next.config.mjs` sets `typescript.ignoreBuildErrors` and `eslint.ignoreDuringBuilds`, so `next build` will not catch type or lint errors. Run `npm run lint` and `npx tsc --noEmit` yourself.
- Remote images are limited to `next.config.mjs` `images.remotePatterns` (`http` on `localhost` and `195.35.56.144`); add new Strapi hosts there.
