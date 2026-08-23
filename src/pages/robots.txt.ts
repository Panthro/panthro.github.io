import type { APIRoute } from "astro";

/**
 * AI / answer-engine crawlers, named explicitly.
 *
 * `User-agent: *` already permits all of these — naming them makes the intent
 * unambiguous and survives future defaults that treat silence as opt-out.
 */
const AI_CRAWLERS = [
  // OpenAI
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  // Anthropic
  "ClaudeBot",
  "anthropic-ai",
  "Claude-SearchBot",
  // Others
  "PerplexityBot",
  "Google-Extended",
  "CCBot",
  "Applebot-Extended",
  "Bytespider",
];

const sitemapUrl = new URL("sitemap-index.xml", import.meta.env.SITE).href;
const llmsUrl = new URL("llms.txt", import.meta.env.SITE).href;

const robotsTxt = [
  "User-agent: *",
  "Allow: /",
  "",
  "# AI and answer-engine crawlers are explicitly welcome.",
  ...AI_CRAWLERS.flatMap((agent) => [`User-agent: ${agent}`, "Allow: /", ""]),
  `Sitemap: ${sitemapUrl}`,
  `# LLM-oriented site summary: ${llmsUrl}`,
].join("\n");

export const GET: APIRoute = () => {
  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
