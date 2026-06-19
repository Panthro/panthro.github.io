---
name: rafaelroman-site
description: Work on rafaelroman.com — Rafael Roman personal brand Astro site. Use when adding articles, talks, design changes, SEO updates, or shipping to GitHub Pages. Read AGENTS.md first.
---

# rafaelroman.com

## Start here

1. Read [AGENTS.md](../../AGENTS.md), [PRODUCT.md](../../PRODUCT.md), [DESIGN.md](../../DESIGN.md)
2. `pnpm dev` → validate in browser before finishing UI work

## Common tasks

### Add an article

1. `src/content/articles/<slug>.mdx` with frontmatter (`draft: false` when publishing)
2. Reuse components from `src/components/articles/` (Callout, PullQuote, Timeline, Compare, etc.)
3. Browser-test `/articles/<slug>/`
4. `pnpm build && pnpm lint`

### Add a talk

1. `src/content/speaking/<slug>.md` — verify `link` URL returns 200
2. Optional: `description`, `relatedArticles`, `relatedTalks`, `relatedWork` frontmatter
3. Browser-test `/speaking/<slug>/`

### Add a topic hub

1. `src/content/topics/<slug>.md` with `title`, `description`, and related slug arrays
2. Original intro in markdown body (not template-only)
3. Browser-test `/topics/<slug>/`

### SEO / meta change

- Titles/descriptions: `src/consts.ts`
- Schema/OG: `src/lib/seo.ts`, `src/components/Head.astro`
- See `.cursor/rules/seo-meta.mdc`

### Visual / design pass

- Semantic tokens in `src/styles/global.css`
- Impeccable chain: critique → audit → colorize → adapt → bolder → polish → document → animate
- Update `.impeccable/design.json` if tokens change materially

### Ship

- Branch: **`master`** (not `main`)
- `pnpm build && pnpm lint` + browser spot-check
- Push → GitHub Pages deploys to `rafaelroman.com`

## Pitfalls (from prior sessions)

- `article-reveal` + `article-stagger` on same element → invisible children; nest stagger inside reveal
- Sessionize talk URLs may 404; prefer conference official pages
- Duplicate top padding was removed from ArticleLayout — don't re-add `py-*` on layout + main
- `.impeccable/critique/` is gitignored — don't commit critique snapshots
