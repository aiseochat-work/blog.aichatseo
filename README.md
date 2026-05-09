# AIChatSEO Blog

Astro blog for `https://blog.aichatseo.com`, deployed on Cloudflare Workers with Neon Postgres and Drizzle.

## Required Environment

Copy `env.sample` locally and configure these values in Cloudflare:

- `DATABASE_URL`: Neon Postgres connection string.
- `PUBLIC_SITE_URL`: `https://blog.aichatseo.com`.
- `SEED_TOKEN`: Optional. Required to use `/seed` outside local development.

## Commands

```sh
npm install
npm run dev
npm run build
npm run db:generate
npm run db:migrate
```

## Database

Run `npm run db:migrate` for normal deploys. The app also performs an idempotent schema bootstrap before blog queries so a fresh Cloudflare deployment does not fail if the `posts` table has not been created yet.

The protected seed utility is available at `/seed?token=YOUR_SEED_TOKEN`. It inserts or refreshes sample posts and is disabled in production without a valid token.

## Cloudflare Notes

Blog pages use edge caching with a short CDN TTL and long stale-while-revalidate window:

`public, max-age=0, s-maxage=300, stale-while-revalidate=86400`

This keeps repeat visits fast without pinning old DB content at the edge for a year.
