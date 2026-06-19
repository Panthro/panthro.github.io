---
name: rafaelroman-site
description: Work on rafaelroman.com — Rafael Roman personal brand Astro site. Use when adding articles, talks, work, topics, design changes, SEO/pSEO updates, or shipping to GitHub Pages. Read AGENTS.md first.
---

# rafaelroman.com

## Start here

1. Read [AGENTS.md](../../AGENTS.md), [PRODUCT.md](../../PRODUCT.md), [DESIGN.md](../../DESIGN.md)
2. `pnpm dev` → validate in browser before finishing UI work

## Common tasks

### Add an article

1. `src/content/articles/<slug>.mdx` with frontmatter (`draft: false` when publishing)
2. Reuse components from `src/components/articles/`
3. Wire `relatedArticles` on related talks/work; update matching topic hub slugs
4. Browser-test `/articles/<slug>/`
5. `pnpm build && pnpm lint`

### Add a talk

1. `src/content/speaking/<slug>.md` — body abstract required
2. Verify `link` URL returns 200 (Sessionize links often 404 — use conference URL)
3. Set `description`, `relatedArticles`, `relatedTalks`, `relatedWork`
4. Browser-test `/speaking/<slug>/`

### Add work entry

1. `src/content/work/<slug>.md` — narrative body required
2. Set `relatedArticles`, `relatedTalks` for cross-linking
3. Browser-test `/work/<slug>/`

### Add a topic hub

1. `src/content/topics/<slug>.md` — `title`, `description`, related slug arrays
2. Write 100+ word original intro in body (not template-only)
3. Only create hubs for clusters with real content overlap
4. Browser-test `/topics/<slug>/`

### SEO / programmatic pages

- **Strategy:** brand first; talks/work/topics support long-tail without thin pSEO
- **Titles:** hub strings in `consts.ts`; detail titles built in layouts (see AGENTS.md)
- **Schema:** `src/lib/seo.ts` — Event (talks), CollectionPage (topics), BlogPosting (articles)
- **Linking:** `src/lib/related.ts` + frontmatter `related*` arrays → `RelatedLinks.astro`
- **Rules:** `.cursor/rules/seo-meta.mdc`, `.cursor/rules/programmatic-seo.mdc`
- **Don't:** tag archives < 3 articles, location doorways, empty body pages

### Visual / design pass

- Semantic tokens in `src/styles/global.css`
- Impeccable chain: critique → audit → colorize → adapt → bolder → polish → document → animate
- Update `.impeccable/design.json` if tokens change materially

### Ship

- Branch: **`master`** (not `main`)
- `pnpm build && pnpm lint` + browser spot-check (homepage, 1 article, 1 talk, 1 topic)
- Push → GitHub Actions deploy → verify live URLs + sitemap

## Pitfalls

- `article-reveal` + `article-stagger` on same element → invisible children; nest stagger inside reveal
- Sessionize talk URLs may 404; prefer conference official pages
- Duplicate top padding removed from ArticleLayout — don't re-add `py-*` on layout + main
- CI uses `npm ci`; local uses pnpm — keep lockfiles aligned
- `.impeccable/critique/` is gitignored
