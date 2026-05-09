export const BLOG_CACHE_CONTROL = 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400';

export function setBlogCacheHeaders(headers: Headers) {
  headers.set('Cache-Control', BLOG_CACHE_CONTROL);
}
