---
name: rafaelroman-site
description: Work on rafaelroman.com — Rafael Roman personal brand Astro site. Use when adding articles, talks, work, topics, journey steps, design changes, SEO/pSEO updates, or shipping to GitHub Pages. Read AGENTS.md first. Sync /journey/ when adding talks or work.
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
4. **Sync journey:** add `src/content/journey/<order>-<slug>.md` with `kind: talk`, `href: "/speaking/<slug>/"`, event-city `lat`/`lng`/`place`, chronological `order` (see `.cursor/rules/journey-sync.mdc`)
5. Browser-test `/speaking/<slug>/` and scroll the step on `/journey/`

### Add work entry

1. `src/content/work/<slug>.md` — narrative body required
2. Set `relatedArticles`, `relatedTalks` for cross-linking
3. **Sync journey:** add or update `src/content/journey/<order>-<slug>.md` with `kind: career`, `href: "/work/<slug>/"`, work-base `lat`/`lng`/`place`, chronological `order`
4. Browser-test `/work/<slug>/` and the step on `/journey/`

### Add a journey step

Use when adding `study` or `project` landmarks, or when splitting/renumbering the timeline. For talks and work, prefer creating the speaking/work file first, then the journey step.

1. `src/content/journey/<order>-<slug>.md` — `order`, `chapter` (`brazil`|`spain`|`switzerland`), `kind` (`study`|`career`|`project`|`talk`), `dateLabel`, `title`, `summary`, `lat`, `lng`, `place`, optional `href`
2. Set `href` to `/work/`, `/speaking/`, or `/articles/` detail pages when applicable
3. Renumber `order` on neighbors if inserting mid-timeline
4. Browser-test `/journey/` — overview at top, map zoom on scroll; light + dark + reduced-motion

### Add a topic hub

1. `src/content/topics/<slug>.md` — `title`, `description`, related slug arrays
2. Write 100+ word original intro in body (not template-only)
3. Only create hubs for clusters with real content overlap
4. Browser-test `/topics/<slug>/`

### Journey sync (mandatory with talks + work)

- Every `/speaking/` entry → journey step (`kind: talk`, event city on map)
- Every `/work/` stint on the path → journey step (`kind: career`, work-base city on map)
- Full rules: `.cursor/rules/journey-sync.mdc` and AGENTS.md § Journey

### SEO / programmatic pages

- **Strategy:** brand first; talks/work/topics support long-tail without thin pSEO
- **Titles:** hub strings in `consts.ts`; detail titles built in layouts (see AGENTS.md)
- **Schema:** `src/lib/seo.ts` — Event (talks), CollectionPage (topics), BlogPosting (articles)
- **Linking:** `src/lib/related.ts` + frontmatter `related*` arrays → `RelatedLinks.astro`
- **Rules:** `.cursor/rules/seo-meta.mdc`, `.cursor/rules/programmatic-seo.mdc`, `.cursor/rules/journey-sync.mdc`
- **Don't:** tag archives < 3 articles, location doorways, empty body pages

### Visual / design pass

- Semantic tokens in `src/styles/global.css`
- Impeccable chain: critique → audit → colorize → adapt → bolder → polish → document → animate
- Update `.impeccable/design.json` if tokens change materially

### Ship

- Branch: **`master`** (not `main`)
- `pnpm build && pnpm lint` + browser spot-check (homepage, 1 article, 1 talk, 1 topic, `/journey/`)
- Push → GitHub Actions deploy → verify live URLs + sitemap

## Pitfalls

- `article-reveal` + `article-stagger` on same element → invisible children; nest stagger inside reveal
- Sessionize talk URLs may 404; prefer conference official pages
- New talk or work without a journey step → missing from `/journey/` timeline and map
- Duplicate top padding removed from ArticleLayout — don't re-add `py-*` on layout + main
- CI uses `npm ci`; local uses pnpm — keep lockfiles aligned
- `.impeccable/critique/` is gitignored
