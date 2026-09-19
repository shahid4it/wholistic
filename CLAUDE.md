# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Layout

Two independent apps in one repo (no root workspace; each has its own `package.json` and lockfiles):

- `backend/` — Strapi 5 CMS (JavaScript) with the GraphQL, users-permissions and CKEditor plugins. Node `>=18 <=22`.
- `frontend/` — Next.js 14 App Router site (TypeScript/JS mix, Sass modules, GSAP).

The root `package.json` only holds stray deps (`jsonwebtoken`); ignore it.

## Commands

Run from inside `backend/` or `frontend/`. There is no test suite configured in either app.

- Backend: `npm run develop` (autoReload, admin at `/admin`), `npm run build` (admin panel), `npm run start`, `npm run console`
- Frontend: `npm run dev`, `npm run build`, `npm run start`, `npm run lint`

## Architecture

**Data flow:** Strapi holds all content (pages, blog, preachers/readers, services, testimonials, horoscope, header/footer). The frontend reads it via GraphQL, server-side.

- Frontend GraphQL queries are plain template strings in `frontend/src/queries/*.js`, one per page/entity. They are executed with `fetchStrapi({ query, key })` from `frontend/src/utils/strapi.js`, which POSTs to `${NEXT_PUBLIC_LANDING_URL}/graphql`, uses `cache: "no-store"` (no Next caching), and returns `json.data[key]`, so `key` must match the root field name in the query. On HTTP errors it logs and returns `{}`.
- `next.config.mjs` rewrites `/graphql` to `STRAPI_GRAPHQL_URL`. This is why `NEXT_PUBLIC_LANDING_URL` points at the frontend origin rather than Strapi.
- Adding a content type: create it in `backend/src/api/<name>/` (content-types, controllers, routes, services) and add a matching query file in `frontend/src/queries/`. Reusable Strapi components live in `backend/src/components/{blogs,preachers,services,ui}`.
- Some Strapi content types have draft/publish removed (see recent commits), so don't assume `status`/`publishedAt` filters.

**Non-GraphQL paths (REST + auth):**
- Newsletter: `frontend/src/app/api/subscribe/route.ts` calls Strapi REST `POST /api/subscribers` with the `STRAPI_SUBSCRIBE_TOKEN` bearer token (`NEXT_PUBLIC_STRAPI_URL`).
- Auth: `frontend/src/app/auth/{login,signup,logout}` use server actions/route handlers with reCAPTCHA, `jsonwebtoken` and cookies.

**Frontend structure:** `frontend/src/app/` holds routes (`readers/[slug]`, `services`, `resources`, `testimonials`, `about`, `contact`, `auth`) and shared UI in `app/components/`. The reader booking modal state is shared via `src/contexts/readerModal.ts`.

## Config notes

- Frontend env: `NEXT_PUBLIC_STRAPI_URL`, `STRAPI_GRAPHQL_URL`, `NEXT_PUBLIC_LANDING_URL`, plus `STRAPI_SUBSCRIBE_TOKEN` (used in code, not in `.env.example`). Backend env: see `backend/.env.example` (Strapi secrets).
- `backend/config/database.js` selects the DB via `DATABASE_CLIENT` (default sqlite; `pg` is installed for Postgres). The local sqlite `data.db` and `public/` uploads are gitignored.
- `next.config.mjs` sets `typescript.ignoreBuildErrors` and `eslint.ignoreDuringBuilds`, so `next build` will not catch type or lint errors. Run `npm run lint` and `npx tsc --noEmit` yourself.
- Remote images are limited to `next.config.mjs` `images.domains` (`localhost` and a fixed IP); add new Strapi hosts there.
