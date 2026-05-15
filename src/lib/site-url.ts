const FALLBACK = 'https://blog.aichatseo.com';

/** Organization entity on the main product site (publisher for blog). */
export const SCHEMA_PUBLISHER_ORG_ID = 'https://www.aichatseo.com/#organization';

function baseOrigin(): string {
  const env = (import.meta.env.PUBLIC_SITE_URL as string | undefined)?.replace(/\/$/, '');
  return env || FALLBACK;
}

/** Root document URL for this blog (trailing slash). */
export function blogDocumentBase(): string {
  const u = new URL('/', `${baseOrigin()}/`);
  return u.href;
}

/** Fragment @id for WebSite node in JSON-LD @graph. */
export function schemaWebSiteId(): string {
  return `${new URL(blogDocumentBase()).origin}/#website`;
}

/** Fragment @id for Blog node in JSON-LD @graph. */
export function schemaBlogId(): string {
  return `${new URL(blogDocumentBase()).origin}/#blog`;
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
