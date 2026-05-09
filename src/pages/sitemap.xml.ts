import type { APIRoute } from 'astro';
import { desc } from 'drizzle-orm';
import { db, ensureDatabaseReady } from '../db';
import { posts } from '../db/schema';
import { absoluteUrl } from '../lib/site-url';

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function urlEntry(loc: string, lastmod?: Date, priority = '0.7') {
  return [
    '  <url>',
    `    <loc>${escapeXml(loc)}</loc>`,
    lastmod ? `    <lastmod>${lastmod.toISOString()}</lastmod>` : '',
    '    <changefreq>weekly</changefreq>',
    `    <priority>${priority}</priority>`,
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n');
}

export const GET: APIRoute = async () => {
  await ensureDatabaseReady();
  const allPosts = await db
    .select({
      slug: posts.slug,
      updatedAt: posts.updatedAt,
      createdAt: posts.createdAt,
    })
    .from(posts)
    .orderBy(desc(posts.updatedAt));

  const entries = [
    urlEntry(absoluteUrl('/'), allPosts[0]?.updatedAt, '1.0'),
    ...allPosts.map((post) =>
      urlEntry(absoluteUrl(`/blog/${post.slug}`), post.updatedAt || post.createdAt, '0.8')
    ),
  ];

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>`,
    {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400',
      },
    }
  );
};
