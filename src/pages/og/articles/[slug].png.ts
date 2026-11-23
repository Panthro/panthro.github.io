import fs from "node:fs";
import { createRequire } from "node:module";
import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import satori from "satori";
import sharp from "sharp";
import { SITE } from "@consts";
import { coverSvg } from "@lib/cover-art";

/**
 * Per-article Open Graph image, rendered at build time: `/og/articles/<slug>.png`.
 * Same visual language as `public/og-default.png` — zinc-950 surface, one
 * Signal Green mark, Bricolage display title, JetBrains Mono meta line.
 *
 * satori needs .woff/.ttf (not woff2), hence the static Bricolage package.
 */
const require = createRequire(import.meta.url);
const font = (pkgPath: string) => fs.readFileSync(require.resolve(pkgPath));

const fonts = [
  {
    name: "Bricolage",
    data: font("@fontsource/bricolage-grotesque/files/bricolage-grotesque-latin-700-normal.woff"),
    weight: 700 as const,
    style: "normal" as const,
  },
  {
    name: "Mono",
    data: font("@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff"),
    weight: 400 as const,
    style: "normal" as const,
  },
];

const BG = "#09090b";
const HEADING = "#fafafa";
const META = "#a1a1aa";
const ACCENT = "#a3e635";

export const getStaticPaths = (async () => {
  const articles = await getCollection("articles", ({ data }) =>
    import.meta.env.DEV ? true : !data.draft
  );
  return articles.map((article) => ({ params: { slug: article.id }, props: { article } }));
}) satisfies GetStaticPaths;

type El = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, children?: unknown): El => ({
  type,
  props: { style, children },
});

export const GET: APIRoute<{ article: CollectionEntry<"articles"> }> = async ({ props }) => {
  const { title, date } = props.article.data;
  const dateLabel = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
  const titleSize = title.length > 70 ? 60 : title.length > 45 ? 70 : 80;

  const tree = h(
    "div",
    {
      width: 1200,
      height: 630,
      display: "flex",
      flexDirection: "column",
      position: "relative",
      paddingTop: 88,
      paddingLeft: 100,
    },
    [
      h("div", { display: "flex", flexDirection: "column", width: 1000 }, [
        h("div", { width: 48, height: 4, backgroundColor: ACCENT, marginBottom: 40 }),
        h(
          "div",
          {
            fontFamily: "Bricolage",
            fontSize: titleSize,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: HEADING,
            display: "flex",
            flexWrap: "wrap",
            width: 1000,
          },
          title
        ),
      ]),
      h(
        "div",
        {
          position: "absolute",
          left: 100,
          top: 520,
          display: "flex",
          justifyContent: "space-between",
          width: 1000,
          fontFamily: "Mono",
          fontSize: 26,
          color: META,
        },
        [h("div", { display: "flex" }, SITE.NAME), h("div", { display: "flex" }, dateLabel)]
      ),
    ]
  );

  const svg = await satori(tree as unknown as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts,
  });
  const text = await sharp(Buffer.from(svg)).png().toBuffer();

  // Cover art behind the text, faded out under the title so it stays legible.
  const art = coverSvg(props.article.id, { width: 1200, height: 630 }, "og");
  const scrim = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <defs><linearGradient id="s" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${BG}" stop-opacity="0.92"/>
      <stop offset="0.55" stop-color="${BG}" stop-opacity="0.75"/>
      <stop offset="1" stop-color="${BG}" stop-opacity="0.15"/>
    </linearGradient></defs>
    <rect width="1200" height="630" fill="url(#s)"/></svg>`;

  const png = await sharp({
    create: { width: 1200, height: 630, channels: 4, background: BG },
  })
    .composite([
      { input: Buffer.from(art) },
      { input: Buffer.from(scrim) },
      { input: text },
    ])
    .png()
    .toBuffer();

  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
};
