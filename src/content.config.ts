import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

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
    draft: z.boolean().optional().default(false),
    tags: z.array(z.string()).optional().default([]),
    related: z.array(z.string()).optional().default([]),
  }),
});

export const collections = { work, speaking, articles, topics };
