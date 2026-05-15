import type { CollectionEntry } from 'astro:content';
import { absoluteUrl } from './site-url';

/** URL segment for a blog post (content layer slug / id without extension). */
export function blogEntrySlug(entry: CollectionEntry<'blog'>): string {
  return entry.slug;
}

/** Blog listing path (posts live under `/blogs/[slug]`). */
export const BLOG_HUB_PATH = '/blogs';

export function blogPostPath(slug: string): string {
  return `${BLOG_HUB_PATH}/${slug}`;
}

/** Absolute URL for the blog hub listing (`/blogs/`). */
export function blogHubAbsoluteUrl(): string {
  return absoluteUrl(`${BLOG_HUB_PATH}/`);
}

export function blogCategoryPath(category: string): string {
  return `${BLOG_HUB_PATH}/${category}/`;
}
