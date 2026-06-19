import { getCollection } from "astro:content";

export type RelatedLink = {
  href: string;
  title: string;
  description?: string;
};

export async function resolveArticleLinks(
  slugs: string[]
): Promise<RelatedLink[]> {
  if (slugs.length === 0) return [];

  const articles = await getCollection("articles", ({ data }) =>
    import.meta.env.DEV ? true : !data.draft
  );

  return slugs
    .map((slug) => articles.find((a) => a.id === slug))
    .filter(Boolean)
    .map((a) => ({
      href: `/articles/${a!.id}/`,
      title: a!.data.title,
      description: a!.data.description,
    }));
}

export async function resolveTalkLinks(slugs: string[]): Promise<RelatedLink[]> {
  if (slugs.length === 0) return [];

  const talks = await getCollection("speaking");

  return slugs
    .map((slug) => talks.find((t) => t.id === slug))
    .filter(Boolean)
    .map((t) => ({
      href: `/speaking/${t!.id}/`,
      title: t!.data.title ?? t!.data.event,
      description: t!.data.description,
    }));
}

export async function resolveWorkLinks(slugs: string[]): Promise<RelatedLink[]> {
  if (slugs.length === 0) return [];

  const work = await getCollection("work");

  return slugs
    .map((slug) => work.find((w) => w.id === slug))
    .filter(Boolean)
    .map((w) => ({
      href: `/work/${w!.id}/`,
      title: w!.data.company,
      description: w!.data.role,
    }));
}

export async function resolveTopicLinks(slugs: string[]): Promise<RelatedLink[]> {
  if (slugs.length === 0) return [];

  const topics = await getCollection("topics");

  return slugs
    .map((slug) => topics.find((t) => t.id === slug))
    .filter(Boolean)
    .map((t) => ({
      href: `/topics/${t!.id}/`,
      title: t!.data.title,
      description: t!.data.description,
    }));
}

export function excerpt(text: string, maxLength = 160): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trim()}…`;
}
