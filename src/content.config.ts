import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * Canonical taxonomy.
 *
 * One vocabulary, not two. Every slug here is a real hub page at
 * `src/content/topics/<slug>.md` → `/topics/<slug>/`, so every tag rendered on an
 * article resolves to a page with original body copy and internal links.
 *
 * Adding a topic = adding a file in `src/content/topics/` AND a slug here.
 * Removing one without removing the tags will surface as a build warning below.
 */
export const TOPIC_SLUGS = [
  "energy-tech",
  "engineering-leadership",
  "fintech-infrastructure",
  "fraud-prevention",
  "stream-processing",
] as const;

export type TopicSlug = (typeof TOPIC_SLUGS)[number];

/**
 * Every article's `tags:` is a valid topic slug today, so a typo should fail the
 * build rather than warn past it.
 */
const STRICT_TAGS = true;

const topicTags = z
  .array(z.string())
  .optional()
  .default([])
  .superRefine((tags, ctx) => {
    const unknown = tags.filter((tag) => !TOPIC_SLUGS.includes(tag as TopicSlug));
    if (unknown.length === 0) return;

    const message = `Unknown tag(s): ${unknown.join(", ")}. Tags must be topic slugs (${TOPIC_SLUGS.join(", ")}), each backed by a hub in src/content/topics/.`;

    if (STRICT_TAGS) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message });
    } else {
      console.warn(`[taxonomy] ${message}`);
    }
  });

const speaking = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/speaking" }),
  schema: z.object({
    title: z.string().optional(),
    event: z.string(),
    date: z.coerce.date(),
    location: z.string(),
    link: z.string().optional(),
    kind: z.enum(["conference", "meetup", "community"]).optional().default("conference"),
    description: z.string().optional(),
    relatedArticles: z.array(z.string()).optional().default([]),
    relatedTalks: z.array(z.string()).optional().default([]),
    relatedWork: z.array(z.string()).optional().default([]),
  }),
});

const work = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/work" }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    dateStart: z.coerce.date(),
    dateEnd: z.union([z.coerce.date(), z.string()]),
    relatedArticles: z.array(z.string()).optional().default([]),
    relatedTalks: z.array(z.string()).optional().default([]),
  }),
});

const topics = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/topics" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    relatedArticles: z.array(z.string()).optional().default([]),
    relatedTalks: z.array(z.string()).optional().default([]),
    relatedWork: z.array(z.string()).optional().default([]),
  }),
});

const articles = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/articles" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    draft: z.boolean().optional().default(false),
    tags: topicTags,
    related: z.array(z.string()).optional().default([]),
  }),
});

const journey = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/journey" }),
  schema: z.object({
    order: z.number(),
    chapter: z.enum(["brazil", "spain", "switzerland"]),
    kind: z.enum(["study", "career", "project", "talk"]),
    dateLabel: z.string(),
    title: z.string(),
    summary: z.string(),
    href: z.string().optional(),
    lat: z.number(),
    lng: z.number(),
    place: z.string().optional(),
    labelDx: z.number().optional(),
    labelBelow: z.boolean().optional(),
  }),
});

export const collections = { work, speaking, articles, topics, journey };
