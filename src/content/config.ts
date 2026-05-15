import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    /** Topic hub for `/blogs/[category]/` indexes. */
    category: z
      .enum([
        'google-search-console',
        'ai-seo',
        'seo-analysis',
        'seo-reporting',
        'technical-seo',
      ])
      .optional(),
    /** Short summary for cards and Open Graph when metaDescription is omitted. */
    description: z.string(),
    excerpt: z.string().optional(),
    metaDescription: z.string().optional(),
    author: z.string().default('AIChatSEO Team'),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    coverImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    /** Extra phrases for `<meta name="keywords">` (merged with `tags`, deduped). */
    seoKeywords: z.array(z.string()).optional(),
    /** Optional FAQ overrides for JSON-LD. If omitted, Q&As are parsed from a `## FAQ` / `## Frequently Asked Questions` section with `###` questions in the post body. */
    faqs: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        })
      )
      .optional(),
    /** Adds SoftwareApplication JSON-LD for product-focused posts (e.g. landing explainers). */
    softwareApplicationSchema: z.boolean().optional(),
    /** Optional HowTo JSON-LD (must match visible step-by-step content on the page). */
    howTo: z
      .object({
        name: z.string(),
        description: z.string().optional(),
        steps: z.array(
          z.object({
            name: z.string(),
            text: z.string(),
          })
        ),
      })
      .optional(),
  }),
});

export const collections = { blog };
