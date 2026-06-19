import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { SITE, ARTICLES } from "@consts";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const GET: APIRoute = async () => {
  const site = import.meta.env.SITE;

  const articles = (
    await getCollection("articles", ({ data }) =>
      import.meta.env.DEV ? true : !data.draft
    )
  ).sort(
    (a, b) => new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf()
  );

  const items = articles
    .map((article) => {
      const url = new URL(`/articles/${article.id}/`, site).href;
      const pubDate = new Date(article.data.date).toUTCString();

      return `
    <item>
      <title>${escapeXml(article.data.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(article.data.description)}</description>
      <pubDate>${pubDate}</pubDate>
      <author>${escapeXml(SITE.NAME)}</author>
    </item>`;
    })
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(`${SITE.NAME} — Writing`)}</title>
    <link>${new URL("/articles/", site).href}</link>
    <description>${escapeXml(ARTICLES.DESCRIPTION)}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(rss.trim(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
};
