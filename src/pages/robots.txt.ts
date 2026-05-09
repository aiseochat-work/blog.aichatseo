import type { APIRoute } from 'astro';
import { absoluteUrl } from '../lib/site-url';

export const GET: APIRoute = () =>
  new Response(
    ['User-agent: *', 'Allow: /', `Sitemap: ${absoluteUrl('/sitemap.xml')}`, ''].join('\n'),
    {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
      },
    }
  );
