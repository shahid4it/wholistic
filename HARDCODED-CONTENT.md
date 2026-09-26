# Hardcoded content to move to Strapi

Found by code review of `frontend/src` (2026-09-20). Nothing here is done yet. Tick each item when it ships.

Legend: **FE** = frontend-only change, **BE** = needs a Strapi schema change (and a backend deploy).

## Phase 1: wire up fields that already exist (FE only, no deploy of the backend) — done 2026-09-26

- [x] **Reader rating**: replaced hardcoded `4.7` with `preacher.rating` (falls back to "New" when a reader has no rating yet).
  - `frontend/src/app/components/reader.tsx`
  - `frontend/src/app/readers/[slug]/page.tsx`
  - Added `rating` to the `preachers` selection in `queries/readers.js`, `queries/psychics-slug.js`, `queries/home.js`, `queries/psychics.js`, `queries/testimonials.js`, `queries/service-slug.js` (every place a reader card is fed). Left the dead, commented-out query in `readers/page.tsx` alone; it's covered by the Phase 4 cleanup item below instead.
- [x] **Site logo**: header and footer render `data.logo.url` (prefixed with `NEXT_PUBLIC_STRAPI_URL`) when the CMS has one, falling back to `/images/logo.svg`.
  - `frontend/src/app/components/header.tsx`
  - `frontend/src/app/components/footer.tsx`
- [x] **Footer social icons**: title is now matched case-insensitively; an unrecognized title renders as a plain text link instead of nothing.
  - `frontend/src/app/components/footer.tsx`
- [ ] **Home intro image**: still falls back to `/images/intro-image.png` when a CMS intro has no image (correct behavior already; this is a content-completeness task for whoever fills in the CMS, not a code change).
  - `frontend/src/app/components/homeIntro.tsx:13`
- [x] **Bug (fixed with this phase)**: `new Array(rating)` threw a RangeError for a decimal or missing rating. Now clamped with `Math.round(rating) || 0` between 0 and 5.
  - `frontend/src/app/components/testimonials/reader-testimonials.tsx`

Verified locally: full Playwright suite re-run against the seeded local stack, 57 passed / 1 failed (the 1 is the pre-existing BUG-07, unrelated to this phase). Confirmed via direct GraphQL query and page HTML that `rating` and the uploaded logo now render.
  - `frontend/src/app/components/testimonials/reader-testimonials.tsx:69`

## Phase 2: content that has no field yet (BE + FE)

### Reader stats
- [ ] Add `reviewCount` (integer) and `totalReadings` (integer) to `preacher`, or compute the review count from linked testimonials. Replace:
  - `(4658)` in `reader.tsx:38` and `readers/[slug]/page.tsx:63`
  - `Total Readings 15,429` in `readers/[slug]/page.tsx:72`

### About page
- [ ] Add `title` (default "About Us"), `missionTitle` and `mission` (rich text) to the `about` single type.
  - `frontend/src/app/about/page.tsx:15` ("About Us")
  - `frontend/src/app/about/page.tsx:27-35` ("Our Mission" and the mission paragraph)

### Site settings (new single type `site-settings`)
- [ ] Fields: `siteTitle`, `siteDescription`, `ogImage`, optional `favicon`.
- [ ] Use them in `generateMetadata` in `frontend/src/app/layout.tsx:16-17` (currently `Wholistic` and `Your companion in your journey to wholeness`).
- [ ] Consider per-page SEO title and description on each page single type.

### Footer
- [ ] Add `linksHeading`, `servicesHeading`, `socialHeading` to `footer`.
  - `footer.tsx:77` ("Quick Links"), `footer.tsx:90` ("Our Services"), `footer.tsx:103` ("Stay Connected")

### Resources pages (blog, video, podcast, horoscope)
- [ ] New single type `resources-page` (or one entry per category) with banner `title` and `content`.
  - `frontend/src/app/resources/horoscope/layout.tsx:15` ("Resources - Horoscopes")
  - `frontend/src/app/resources/[category]/page.tsx` (banner "Resources - {category}")
  - `frontend/src/app/resources/video/page.tsx` (banner "Video")
  - `frontend/src/app/resources/video/Modal.tsx:17` ("Video")

### Service pages
- [ ] Add a `title` field to `ui.intro`, and use it instead of the hardcoded "When do you need this service?".
  - `frontend/src/app/services/[slug]/page.tsx` (`COMP_MAP` `ComponentUiIntro`)

### Horoscope
- [ ] Add `dateRange` (string) to `horoscope`, or keep the ranges as static reference data if they never change. Then remove the map.
  - `frontend/src/app/resources/horoscope/[star]/Carousal.tsx:9-20`

### Booking (ties to bug BUG-07 in `QA-REPORT.md`)
- [ ] Decide what a booking is: a new `booking` collection, an email to the reader, or an external calendar tool.
- [ ] Add per-reader availability, or a `timeSlots` field, and replace the default slots.
  - `frontend/src/app/components/BookingForm.tsx:8` (`10:00am - 10:30am`, `11:15am - 12:15pm`, `12:30pm - 1:30pm`)
- [ ] Make the form submit to that backend (today it only calls `preventDefault()`).

## Phase 3: UI labels (optional, only if the client wants to edit copy without a deploy)

Suggested approach: one `ui-labels` single type, or a JSON component, instead of one field per string.

- [ ] **Booking UI**: "Book a Session", "Booking With …", "Please select a Reader or Healer", "No healers available at the moment", "No Readers available at the moment", "Full Name", "Email", "Contact", "Services", "Message", "Cancel".
  - `BookASession.tsx`, `BookingForm.tsx`, `BookingFormModal.tsx`, `readers.tsx:52`
- [ ] **Newsletter form**: labels, placeholders, "Successfully subscribed", "Signing up…", "Sign up".
  - `SubscribeForm.tsx`
- [ ] **Login and signup copy**: including the typo "Your missing out" (should be "You're missing out").
  - `frontend/src/app/auth/login/page.tsx:54`
  - `frontend/src/app/auth/signup/page.tsx:78`
- [ ] **Reader page headings**: "Abilities", "Tools", "Style", "Topics", "About {name}", "What people say about {name}", "Articles by {name}".
  - `readers/[slug]/page.tsx`, `testimonials/reader-testimonials.tsx:60`
- [ ] **Misc**: "Load More" (`readers.tsx:44`), "Book a session" (`reader.tsx:53`).
- [ ] **Image `alt` text**: most images use "Hero Background", "Reader Image", "Founder" or empty. Add alt text fields to `ui.banner`, `ui.section`, `ui.intro`, and use the reader's name for profile images (accessibility, not just editability).

## Phase 4: dead code and cleanup (FE)

- [ ] Remove the commented-out Client Favorites section, and the inline query it feeds (`rating >= 4.3`, which still runs on every load of `/readers` and is unused).
  - `frontend/src/app/readers/page.tsx:22-46`
- [ ] Remove the commented-out FAQ sample content copied from an unrelated site.
  - `frontend/src/app/components/faq.tsx:13-22`
- [ ] Replace the duplicate month-name arrays with one date-format helper (`toLocaleDateString`).
  - `resources/[category]/page.tsx`, `resources/video/page.tsx`

## Suggested order
1. Phase 1 (one small PR, no backend work).
2. Reader stats, About page and Footer headings (small schema changes, one backend deploy).
3. `site-settings` and `resources-page`.
4. Booking (needs a product decision first).
5. Phase 3 and Phase 4 as time allows.

## Notes for whoever does the backend work
- After any schema change, restart Strapi and give the frontend's API token any new permissions.
- Use `backend/scripts/seed-local.js` (add the new fields there) so the local stack and e2e tests keep working.
- Content types in this project have `draftAndPublish` turned off, so no publish step is needed.
