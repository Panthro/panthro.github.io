import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const work = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/work" }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    dateStart: z.coerce.date(),
    dateEnd: z.union([z.coerce.date(), z.string()]),
  }),
});

const speaking = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/speaking" }),
  schema: z.object({
    title: z.string().optional(),
    event: z.string(),
    date: z.coerce.date(),
    location: z.string(),
    link: z.string().optional(),
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

export const collections = { work, speaking, articles };
