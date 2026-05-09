import { index, pgTable, serial, text, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core';

/** Post content is HTML. Per-post SEO and display fields live here; site-wide defaults stay in Layout. */
export const posts = pgTable(
  'posts',
  {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    content: text('content').notNull(),
    excerpt: text('excerpt'),
    /** SEO: overrides meta and Open Graph description when set; otherwise excerpt is used. */
    metaDescription: text('meta_description'),
    coverImage: varchar('cover_image', { length: 512 }),
    author: varchar('author', { length: 255 }),
    tags: text('tags').array(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    slugIdx: uniqueIndex('posts_slug_unique').on(table.slug),
    createdAtIdx: index('posts_created_at_idx').on(table.createdAt),
    updatedAtIdx: index('posts_updated_at_idx').on(table.updatedAt),
    tagsIdx: index('posts_tags_idx').using('gin', table.tags),
  })
);
