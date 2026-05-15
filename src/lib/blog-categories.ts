export const BLOG_CATEGORY_SLUGS = [
  'google-search-console',
  'ai-seo',
  'seo-analysis',
  'seo-reporting',
  'technical-seo',
] as const;

export type BlogCategorySlug = (typeof BLOG_CATEGORY_SLUGS)[number];

export const BLOG_CATEGORY_LABELS: Record<BlogCategorySlug, string> = {
  'google-search-console': 'Google Search Console',
  'ai-seo': 'AI SEO',
  'seo-analysis': 'SEO analysis',
  'seo-reporting': 'SEO reporting',
  'technical-seo': 'Technical SEO',
};

/** Main product URLs on www (blog is on a subdomain). */
export const MARKETING_ORIGIN = 'https://www.aichatseo.com';

export function marketingPath(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${MARKETING_ORIGIN}${p}`;
}
