import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { blogEntrySlug, blogPostPath, BLOG_HUB_PATH, blogCategoryPath } from '../lib/blog-slug';
import { BLOG_CATEGORY_SLUGS } from '../lib/blog-categories';
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
  const allPosts = (await getCollection('blog')).sort(
    (a, b) => (b.data.updatedDate ?? b.data.pubDate).valueOf() - (a.data.updatedDate ?? a.data.pubDate).valueOf()
  );

  const latestPostMod = allPosts[0]
    ? allPosts[0].data.updatedDate ?? allPosts[0].data.pubDate
    : undefined;

  const entries = [
    urlEntry(absoluteUrl('/'), latestPostMod, '1.0'),
    urlEntry(absoluteUrl(`${BLOG_HUB_PATH}/`), latestPostMod, '1.0'),
    ...BLOG_CATEGORY_SLUGS.map((cat) => urlEntry(absoluteUrl(blogCategoryPath(cat)), latestPostMod, '0.75')),
    ...allPosts.map((post) =>
      urlEntry(
        absoluteUrl(blogPostPath(blogEntrySlug(post))),
        post.data.updatedDate ?? post.data.pubDate,
        '0.8'
      )
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
