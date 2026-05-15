# AIChatSEO Blog

Astro blog for `https://blog.aichatseo.com`, deployed on Cloudflare Workers. Posts are **static** Markdown/MDX files in `src/content/blog/` (no database).

## Environment

Copy `env.sample` locally if you need overrides. For Cloudflare, set:

- `PUBLIC_SITE_URL`: `https://blog.aichatseo.com` (also set in `wrangler.jsonc` as needed).

## Commands

```sh
npm install
npm run dev
npm run build
npm run deploy
```

## Writing posts

Add `.md` or `.mdx` files under `src/content/blog/`. Frontmatter is validated in `src/content/config.ts` (title, description, `pubDate`, optional `category` for hub pages, tags, cover image, etc.). The URL slug comes from the filename (e.g. `traffic-drop-search-console.mdx` → `/blogs/traffic-drop-search-console/`).

**Note:** Topic hub routes use `/blogs/{category}/` (for example `/blogs/google-search-console/`). Avoid creating a post whose **filename/slug equals a `category` id**, or that topic index will be overwritten at build time.

**Hub:** all posts live under **`/blogs/`** with optional topic indexes at **`/blogs/{category}/`** (see `src/lib/blog-categories.ts`). The site root **`/`** redirects to **`/blogs/`**. Legacy **`/blog/*`** URLs redirect to **`/blogs/*`** via `public/_redirects` on Cloudflare.

## Cloudflare Notes

Pages use edge caching with a short CDN TTL and long stale-while-revalidate window:

`public, max-age=0, s-maxage=300, stale-while-revalidate=86400`
