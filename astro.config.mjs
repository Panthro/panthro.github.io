import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

const ARTICLES_DIR = fileURLToPath(new URL("./src/content/articles", import.meta.url));

/**
 * Map of `/articles/<slug>/` → ISO date, read straight from MDX frontmatter so
 * the sitemap's `lastmod` reflects the content, not the build clock.
 * Uses `updated` when present, otherwise the publish `date`.
 *
 * Only articles get a `lastmod`: they are the only pages whose frontmatter
 * carries a date that genuinely tracks revisions. Stamping every URL with the
 * build timestamp would tell crawlers the whole site changed on every deploy.
 */
function articleLastmod() {
  const map = new Map();
  if (!fs.existsSync(ARTICLES_DIR)) return map;

  for (const file of fs.readdirSync(ARTICLES_DIR)) {
    if (!file.endsWith(".mdx") && !file.endsWith(".md")) continue;

    const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), "utf8");
    const frontmatter = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!frontmatter) continue;

    const read = (key) => {
      const match = frontmatter[1].match(
        new RegExp(`^${key}:\\s*["']?([0-9]{4}-[0-9]{2}-[0-9]{2})["']?\\s*$`, "m")
      );
      return match ? match[1] : null;
    };

    const stamp = read("updated") ?? read("date");
    if (!stamp) continue;

    const parsed = new Date(`${stamp}T00:00:00Z`);
    if (Number.isNaN(parsed.valueOf())) continue;

    map.set(`/articles/${file.replace(/\.mdx?$/, "")}/`, parsed.toISOString());
  }

  return map;
}

const LASTMOD = articleLastmod();

export default defineConfig({
  site: "https://rafaelroman.com",
  integrations: [
    mdx(),
    react(),
    sitemap({
      serialize(item) {
        const { pathname } = new URL(item.url);
        const lastmod = LASTMOD.get(pathname);
        if (lastmod) item.lastmod = lastmod;
        return item;
      },
    }),
    tailwind(),
  ],
  // Legacy WordPress permalinks. Astro emits a meta-refresh + canonical page for
  // each, which is what GitHub Pages can serve without a redirect layer.
  //
  // Only URLs with hard evidence are listed. `/2021/08/09/out-of-bootcamp/` is
  // confirmed: it 404s today and is linked from a published article
  // (src/content/articles/straight-out-of-the-bootcamp.mdx).
  //
  // TODO(rafa): pull the full legacy 404 list from Search Console
  // ("Pages → Not found (404)") or the Wayback Machine index for
  // rafaelroman.com and add the rest here. Do not guess permalink shapes.
  redirects: {
    "/2021/08/09/out-of-bootcamp": "/articles/straight-out-of-the-bootcamp/",
  },
  markdown: {
    shikiConfig: {
      theme: "github-dark",
    },
  },
});
