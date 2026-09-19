# QA Report: Wholistic (Next.js frontend + Strapi backend)

**Method:** static code review plus manual test-case design. Nothing was executed: no build, lint, type check, `npm audit` or browser run. Every bug below is a code-level finding and must be confirmed against a running stack. The e2e specs in `frontend/e2e/` are written to do that confirmation. Tests tagged `[BUG-nn]` assert the correct behaviour, so they are expected to fail until the bug is fixed.

**Not covered:** Sass/visual regression, the `about`, `contact`, `services` and `testimonials` page internals, and the Strapi admin UI.

## 1. Summary

| Severity | Count |
|---|---|
| Critical | 4 |
| High | 7 |
| Medium | 10 |
| Low | 7 |

Release recommendation: **do not ship** until BUG-01 to BUG-04 are fixed. They affect user identity, credential exposure and auth.

## 1a. Execution results (2026-09-20)

Run against a **local** stack: Next.js dev server plus Strapi with seeded sqlite data (`backend/scripts/seed-local.js`). The live server at `195.35.56.144` was not tested, because the write tests would create real subscribers there.

Playwright, desktop project: **57 tests, 38 passed, 19 failed on the first run.** After fixing two test races (TC-22, TC-23) and adding TC-45, `auth.spec.ts` re-ran with 5 passed and 7 failed. Every remaining failure is a `[BUG-nn]` test or a real defect, and none is a test-infrastructure error. The mobile project was not run.

| Bug | Evidence | Status |
|---|---|---|
| BUG-01 | TC-19: header showed "Qa Tester" (an earlier subscriber) for a user registered as "Mine Tester" | **Confirmed** |
| BUG-02 | TC-25 + direct API call: `password` is returned in `/api/subscribers` (null for newsletter subscribers, present for signups) | **Confirmed** |
| BUG-04 | TC-22: auth cookie is not `httpOnly`. TC-24: `GET /auth/logout` returns 307 | **Confirmed** |
| BUG-05 | TC-37: malicious slug returns 500 | **Confirmed** (crash, not proven exploitable) |
| BUG-06 | TC-06, TC-07: unknown reader or blog slug returns 500 instead of 404 | **Confirmed** |
| BUG-07 | TC-30: no request on submit. TC-31: no validation | **Confirmed** |
| BUG-08 | TC-16, TC-17: mismatched or empty passwords show no inline error | **Confirmed** |
| BUG-09 | TC-32: 1st of the month appears under "Wed" instead of "Tue" | **Confirmed** |
| BUG-12 | TC-13, TC-13b: invalid JSON and missing `fullName` return 500 | **Confirmed** |
| BUG-13 | TC-11: raw message "This attribute must be unique" is shown | **Confirmed** |
| BUG-15 | Readers query fires on page load before the modal opens | **Confirmed** |
| BUG-19 | TC-05: `/resources/horoscope/aries` renders empty content | **Confirmed** |
| BUG-27 (new) | TC-45 + curl: emails with `+` cannot log in (see below) | **Confirmed** |
| BUG-28 (new) | TC-42: no `X-Content-Type-Options` header (and CSP/frame headers were not checked) | **Confirmed** |
| BUG-03, BUG-10, BUG-14, BUG-16 | Not exercised yet (captcha and rate limits, enumeration, caching, XSS via CMS content) | Unverified |

Passing: all 12 horoscope signs, every route smoke test, no console errors on home, no horizontal scroll at 375, 768 and 1440 px, and TC-09 (blocking `/graphql` in the browser). TC-09 does not cover a server-side Strapi outage.

### Fixed (2026-09-20, verified by re-running the full desktop suite: 57 passed, 1 failed; the failure is TC-30, see BUG-07 below)

| Bug | Fix |
|---|---|
| BUG-01 | Header decodes the JWT payload and looks the user up with `filters[id][$eq]` (`frontend/src/utils/session.ts`, `header.tsx`). TC-19 passes. |
| BUG-02 | `password` is `private` in the subscriber schema, so it is no longer returned. Credentials are checked in a new Strapi endpoint `POST /api/subscribers/login` (constant-time compare). TC-25 passes. |
| BUG-27 | Login sends email and password in a JSON body, so nothing is put in a URL. TC-45 passes. |
| BUG-04 | Cookie is `httpOnly`, `sameSite=lax`, 7-day `maxAge` (`secure` when `COOKIE_SECURE=true`). JWT has HS256 pinned and a 7-day expiry. Logout is POST-only (303). TC-22, TC-23, TC-24 pass. |
| BUG-05 | Route params are embedded with `gql()` (JSON-escaped string literal) in every query. Malicious slugs now return 404. TC-37 passes. |
| BUG-06 | `fetchStrapi` no longer throws on network errors or `data: null`. Slug pages use `asList()` and `notFound()`; reader profile image is null-safe. TC-06, TC-07 pass. |
| BUG-08 | Signup validates names, email format, password length (8+) and matching passwords, and shows a friendly message for a duplicate email. TC-16, TC-17, TC-18 pass. |
| BUG-09 | Calendar grid is Monday-first to match the header labels; the previous-month limit compares year and month together; the hidden date field is `YYYY-MM-DD`. TC-32, TC-34 pass. |
| BUG-12, BUG-13 | Subscribe route validates input (4xx, not 500), splits names correctly, and returns "This email is already subscribed" (409) for duplicates. TC-11, TC-12, TC-13, TC-13b pass. |
| BUG-15 | Readers are fetched the first time the booking modal opens instead of on every page load. |
| BUG-17 | Removed the debug `console.log(blogs)`. |
| BUG-19 | Horoscope sign is matched case-insensitively against the 12 signs; anything else is a 404. TC-05 passes. |
| BUG-28 | `next.config.mjs` sends `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` and drops `X-Powered-By`. TC-42 passes. No CSP yet (needs care with inline scripts and reCAPTCHA). |
| BUG-07 (partly) | Booking form fields are now `required` with proper `email` and `tel` types. **Still open:** submitting sends nothing, because there is no booking endpoint or content type on the backend (TC-30). |
| BUG-10 (partly) | Unknown email, wrong password and password-less accounts all return the same "Invalid email or password". Still open: rate limiting. |

**Deployment notes:** (1) The Strapi API token used by the frontend needs the new `subscriber.login` permission (Admin, Settings, API Tokens). (2) Set `COOKIE_SECURE=true` only when the site is served over HTTPS, because on plain HTTP a secure cookie is never sent. (3) `JWT_SECRET` must be set in the frontend environment. (4) Restart Strapi after deploying, since the schema and routes changed.

## 2. Bugs

**BUG-27 (High): logins fail for emails containing `+`**
- Location: `filters[email][$eq]=${email}` in [login/action.ts](frontend/src/app/auth/login/action.ts)
- The email is not URL-encoded, so `+` is read as a space and Strapi finds no match. Verified with curl: `qa+probe@example.com` returns 0 rows and `qa%2Bprobe@example.com` returns 1. Anyone who signed up with plus-addressing (common with Gmail) can never log in, and gets "invalid email entered".
- Fix: `encodeURIComponent(email)`, or build the query with `URLSearchParams`.

**BUG-28 (Medium): missing security response headers**
- No `X-Content-Type-Options: nosniff`. Add headers in `next.config.mjs` (`headers()`) or at nginx.

### Critical

**BUG-01: Logged-in user is misidentified in the header**
- Location: [header.tsx:18-30](frontend/src/app/components/header.tsx#L18-L30)
- `jwt.verify` returns the payload `{id, iat}`, but it is interpolated as `?id=${id}` → `id=[object Object]`. `id` is also not a valid Strapi filter (`filters[id][$eq]`). The query likely returns the whole list and `data[0]` is used, so every logged-in visitor may appear as the first subscriber.
- Repro: sign up as user B while user A already exists, then inspect the header account state.
- Expected: header shows user B. Actual (predicted): shows the first subscriber.

**BUG-02: Password hashes are readable through the REST API**
- Location: [schema.json](backend/src/api/subscriber/content-types/subscriber/schema.json); [login/action.ts](frontend/src/app/auth/login/action.ts)
- `password` is a normal attribute, so `GET /api/subscribers` with the subscribe token returns every email and salt:hash. Login compares hashes inside the Next server, which requires that exposure. `STRAPI_SUBSCRIBE_TOKEN` also gives list access to all subscribers' personal data.
- Fix direction: `"private": true` on `password`, verify server-side in Strapi, and scope the token to `create` only.

**BUG-03: reCAPTCHA is disabled, with a hardcoded token**
- Location: [login/page.tsx:16](frontend/src/app/auth/login/page.tsx#L16), [signup/page.tsx:16](frontend/src/app/auth/signup/page.tsx#L16), both `action.ts` files.
- `captchaToken` defaults to `"abcd"`, the widget is commented out, and the server-side verification is commented out. There is no rate limiting, so login is open to credential stuffing and signup to bot spam.

**BUG-04: Insecure auth cookie and JWT**
- Location: `cookies().set("auth", token)` in both actions; [logout/route.ts](frontend/src/app/auth/logout/route.ts).
- No `httpOnly`, `secure`, `sameSite` or `maxAge`. The JWT has no `exp` and no pinned algorithm, so a stolen token is valid forever. Logout is a `GET`, so `<img src="/auth/logout">` on any site logs a user out (CSRF). Logout is also declared `"use server"` in a route file.

### High

**BUG-05: Injection in GraphQL and REST strings**
- Location: [psychics-slug.js](frontend/src/queries/psychics-slug.js) and other `*-slug` queries, `horoscope` query, and `filters[email][$eq]=${email}` in the login action.
- Route params (`/readers/[slug]`, `/resources/horoscope/[star]`) are interpolated raw. A slug containing `"` breaks the query, and a crafted value can alter the filter. An unencoded `email` such as `a&filters[password][$notNull]=true` alters the REST query.

**BUG-06: A failed GraphQL call crashes pages (`fetchStrapi` returns `{}`)**
- Location: [strapi.js](frontend/src/utils/strapi.js) with all callers. Also `json.data[key]` throws if `data` is null (GraphQL errors return HTTP 200 with `data: null`).
- Examples: horoscope page does `const [data = ...] = {}` → "not iterable" TypeError. [BookASession.tsx:24](frontend/src/app/components/BookASession.tsx#L24) does `staff.filter` on `{}` → runtime error in the header on every page. The readers page does `[[reader], ...]`, so an unknown slug gives `reader.profile.url` TypeError instead of a 404.
- Expected: `notFound()` or an error boundary. Actual: 500 or a client crash.

**BUG-07: "Book a Session" does nothing**
- Location: [BookingForm.tsx:14-16](frontend/src/app/components/BookingForm.tsx#L14-L16)
- `onSubmit` only calls `preventDefault()`. Nothing is sent, and there is no confirmation. Users believe they booked. Fields have no `required`, the email input is `type` text, and the contact field has no validation. The time slots are a hardcoded default (`10:00am - 10:30am`, ...), not per-reader availability.

**BUG-08: Signup skips validation**
- Location: [signup/action.ts](frontend/src/app/auth/signup/action.ts)
- `repassword` is never compared to `password`. There are no length or strength rules. Empty fields go to `scryptSync(undefined)`, which throws a 500 (`password` is undefined if the field is missing). A duplicate email surfaces as the raw Strapi message. Error rendering only shows `formState.fields.*`, so a server error with `fields: {}` shows nothing per field.

**BUG-09: Calendar is misaligned**
- Location: [Calender.tsx:29-38,134-142](frontend/src/app/components/Calender.tsx#L29-L38)
- The header labels start with Mon (Mon...Sun) but the grid uses `getDay()` (Sunday = 0). Every date sits under the wrong weekday, so a user picking "Tuesday the 6th" actually gets a different weekday. This is a booking-correctness bug.

**BUG-10: Login leaks which emails exist and crashes for password-less subscribers**
- Location: [login/action.ts:64-72](frontend/src/app/auth/login/action.ts#L64-L72)
- `password` from `FormData` can be a `File` or undefined. When the email is unknown the response says "invalid email entered" while a wrong password says "incorrect password entered", which allows account enumeration. The `[salt, hash] = targetPassword.split(":")` throws if the stored password is null (legacy or newsletter-created subscribers via `/api/subscribe` have no password).

### Medium

| ID | Finding | Location |
|---|---|---|
| BUG-11 | Calendar `onPrev` compares year and month separately, which mis-handles year boundaries; `selectedData` stores time via `toLocaleString()` in a hidden field. `new Date()` in client-component state also risks a hydration mismatch. | Calender.tsx:68-75, 93 |
| BUG-12 | Newsletter route: `fullName.split(" ")` fails on empty or multi-word names (`lastName` gets only the second word). Non-JSON body gives a 500. The route is unauthenticated and unthrottled. | api/subscribe/route.ts |
| BUG-13 | Newsletter success message is shown inside a form that still allows immediate resubmission. Duplicate email (unique) returns the raw Strapi text. | SubscribeForm.tsx |
| BUG-14 | Header does a live user lookup with `cookies()` on every request, so the whole site is dynamic. This is slow and defeats caching. | header.tsx, layout |
| BUG-15 | Every page issues a client-side GraphQL call for the readers list from the header's `BookASession`, even when the modal is never opened. The request is duplicated per page navigation. | BookASession.tsx:18-22 |
| BUG-16 | Unsanitized CMS HTML rendered with `dangerouslySetInnerHTML` (blog, horoscope, footer copyright). | resources pages, footer.tsx |
| BUG-17 | Debug `console.log(blogs)` runs on every reader page render (server log noise, may leak content). | readers/[slug]/page.tsx:24 |
| BUG-18 | Reader profile image uses `alt=""` for meaningful content, and modal/calendar buttons are icon-only with no `aria-label` (accessibility). | multiple |
| BUG-19 | `/resources/horoscope/[star]` is case-sensitive and unvalidated; `/resources/horoscope/aries` vs `Aries` may return empty content. The redirect to `Aries` is hardcoded. | horoscope page, next.config.mjs |

### Low

| ID | Finding |
|---|---|
| BUG-20 | Hardcoded rating `4.7` on every reader page ([readers/[slug]/page.tsx](frontend/src/app/readers/[slug]/page.tsx)). |
| BUG-21 | List keys use index or name (`key={i}`, `key={reader.name}`), which is unstable when CMS data changes. |
| BUG-22 | `images.domains` contains a fixed IP; `domains` is deprecated. Uploads from other hosts fail with an image-host error. |
| BUG-23 | `ignoreBuildErrors` and `ignoreDuringBuilds` hide all type and lint failures. |
| BUG-24 | No `error.tsx`, `not-found.tsx` or `loading.tsx`, so users see framework defaults. |
| BUG-25 | Static assets over 1 MB each (`testimonials-bg.png` 2.8 MB, `hero.png` 2.2 MB). |
| BUG-26 | Typo `Calender.tsx`; `.env.example` lacks `STRAPI_SUBSCRIBE_TOKEN`, `JWT_SECRET`, `CAPTCHA_SECRET_KEY`, `NEXT_PUBLIC_CAPTCHA_SITE_KEY`. |

## 3. Test cases

Automation status: **A** = automated in `frontend/e2e/`, **M** = manual. "Stack" means Strapi plus frontend running with seed content.

### Navigation and content
| ID | Case | Expected | Auto |
|---|---|---|---|
| TC-01 | Load `/` | 200, header, footer, home sections render, no console errors | A |
| TC-02 | Visit each of `/about`, `/contact`, `/services`, `/readers`, `/testimonials`, `/resources/video` | 200, `<h1>`/main content present | A |
| TC-03 | `/resources/horoscope` | Redirects to `/resources/horoscope/Aries` | A |
| TC-04 | Each of the 12 signs | Title shows sign, content non-empty | A |
| TC-05 | `/resources/horoscope/aries` (lowercase) | Same content as `Aries` (BUG-19) | A |
| TC-06 | `/readers/does-not-exist` | Proper 404 page, not 500 (BUG-06) | A |
| TC-07 | `/resources/blog/does-not-exist` | Proper 404 | A |
| TC-08 | Open a reader from `/readers` | Reader page shows name, bio, testimonials | A |
| TC-09 | Broken Strapi (block `/graphql`) | Friendly error, no crash (BUG-06) | A |

### Newsletter
| ID | Case | Expected | Auto |
|---|---|---|---|
| TC-10 | Submit valid name and email | Success message, fields cleared | A |
| TC-11 | Submit the same email again | Friendly duplicate message (BUG-13) | A |
| TC-12 | Single-word name | Succeeds without a server error (BUG-12) | A |
| TC-13 | POST `/api/subscribe` with invalid JSON | 4xx JSON error, not 500 | A |
| TC-14 | Submit 20 times in 10 s | Throttled (BUG-12) | M |

### Signup and login
| ID | Case | Expected | Auto |
|---|---|---|---|
| TC-15 | Signup, all valid | Redirect to `/`, header shows the new user | A |
| TC-16 | Signup, mismatched passwords | Inline error, no account created (BUG-08) | A |
| TC-17 | Signup, empty password | Inline error, no 500 (BUG-08) | A |
| TC-18 | Signup, existing email | Friendly error | A |
| TC-19 | Login, valid | Redirect `/`, header shows *that* user, not another (BUG-01) | A |
| TC-20 | Login, wrong password / unknown email | Identical generic error (BUG-10) | A |
| TC-21 | Login as a newsletter-only subscriber (no password) | Graceful error, no 500 (BUG-10) | A |
| TC-22 | Cookie flags after login | `httpOnly`, `secure` (prod), `sameSite`, expiry (BUG-04) | A |
| TC-23 | Logout via link | Cookie cleared, header logged out | A |
| TC-24 | `GET /auth/logout` cross-site (`<img>`) | Must not log the user out (BUG-04) | M |
| TC-25 | `GET /api/subscribers` with the frontend's token | Must not return `password` (BUG-02) | A (API) |
| TC-26 | Login with the CAPTCHA token altered | Rejected server-side (BUG-03) | M |
| TC-27 | 30 failed logins in a minute | Rate limited (BUG-03) | M |

### Booking
| ID | Case | Expected | Auto |
|---|---|---|---|
| TC-28 | Click **Book a Session** in header | Modal opens listing healers and readers | A |
| TC-29 | Pick a reader | Form title "Booking With <name>", services list is that reader's | A |
| TC-30 | Submit form | Request sent, confirmation shown (BUG-07) | A |
| TC-31 | Submit empty form | Validation errors (BUG-07) | A |
| TC-32 | Calendar day 1 of a known month | Sits under the correct weekday (BUG-09) | A |
| TC-33 | Past days | Not selectable | A |
| TC-34 | Prev-month button at the current month | No navigation before the current month, also across year boundary | A |
| TC-35 | Cancel / close modal | Modal closes, reader selection resets | A |
| TC-36 | Keyboard: Esc, tab focus trap, focus return | Modal is accessible (BUG-18) | M |

### Security, performance, cross-cutting
| ID | Case | Expected | Auto |
|---|---|---|---|
| TC-37 | `/readers/x" ) { id } #` | 404 or safe error, no GraphQL error text leaked (BUG-05) | A |
| TC-38 | Blog content with `<img onerror>` in CMS | Not executed (BUG-16) | M |
| TC-39 | Lighthouse on `/` (mobile) | Performance ≥ 80, LCP < 2.5 s (BUG-25) | M |
| TC-40 | Page weight of `/` | < 2 MB transferred | M |
| TC-41 | Viewports 375, 768, 1440 | No horizontal scroll, header menu usable | A |
| TC-42 | Response headers on `/` | CSP, `X-Content-Type-Options`, frame protection | A |
| TC-43 | Strapi `/graphql` introspection in prod | Disabled | M |
| TC-44 | CORS from a foreign origin to Strapi | Rejected | M |
| TC-45 | Login with an email containing `+` | Redirects home (BUG-27) | A |

## 4. Running the e2e suite

Nothing is installed yet. From `frontend/`:

```
npm i -D @playwright/test && npx playwright install chromium
E2E_BASE_URL=http://localhost:3000 E2E_STRAPI_URL=http://localhost:1337 npx playwright test
```

Strapi and the frontend must be running with seeded content (at least one reader, blog post and horoscope for Aries). Tests that create users use unique emails and leave data behind, so use a throw-away database.

## 5. Recommended fix order
1. BUG-01, BUG-02, BUG-04 (identity, hash exposure, cookie).
2. BUG-03, BUG-05, BUG-08 (captcha and rate limiting, injection, signup validation).
3. BUG-06, BUG-07, BUG-09 (crash handling, booking submit, calendar alignment).
4. Remaining medium and low items, then re-run the full suite.
