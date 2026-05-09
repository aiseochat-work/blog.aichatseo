const FALLBACK = 'https://blog.aichatseo.com';

function baseOrigin(): string {
  const env = (import.meta.env.PUBLIC_SITE_URL as string | undefined)?.replace(/\/$/, '');
  return env || FALLBACK;
}

/** Canonical URL for the current request path (use for meta + JSON-LD). */
export function canonicalFromRequest(url: URL): string {
  const base = baseOrigin();
  return new URL(url.pathname + url.search, `${base}/`).href;
}

export function absoluteUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) return pathOrUrl;
  const base = baseOrigin();
  const p = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return new URL(p, `${base}/`).href;
}
