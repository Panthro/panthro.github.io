# Agent guide — rafaelroman.com

Personal brand site for **Rafael Roman** (CTO & Co-founder, Upgrid). Astro 6 static site deployed to GitHub Pages at `https://rafaelroman.com` (repo default branch: **`master`**, not `main`).

## Read first

| Doc | Purpose |
|-----|---------|
| [PRODUCT.md](./PRODUCT.md) | Audience, voice, anti-references, product goals |
| [DESIGN.md](./DESIGN.md) | “Basel Monolith” design system — colors, type, components, do's/don'ts |
| [.impeccable/design.json](./.impeccable/design.json) | Machine-readable design tokens (keep in sync when changing visuals) |

**SEO goal:** Personal brand first (`Rafael Roman`, CTO Upgrid). Articles and talks support topical authority (fintech, distributed systems, energy). No traffic baseline yet — site relaunched June 2026.

## Stack & commands

```bash
pnpm install
pnpm dev              # http://localhost:4321
pnpm build            # astro check + static build → dist/
pnpm lint
pnpm preview
```

- **Package manager:** pnpm (`pnpm-lock.yaml`)
- **Site URL:** `astro.config.mjs` → `site: "https://rafaelroman.com"`
- **Content:** Astro Content Collections via `src/content.config.ts` + glob loaders
- **UI:** Tailwind + `@tailwindcss/typography`; article MDX uses React islands (`@astrojs/react`)

## Repository map

```
src/
  components/
    Head.astro          # Meta, OG, theme JS, ToC spy, scroll reveals
    JsonLd.astro        # JSON-LD script tags
    ArticleEntry.astro  WorkEntry.astro  TalkEntry.astro
    articles/*.tsx      # Rich MDX components (see below)
  content/
    articles/*.mdx      # Blog posts (draft flag excludes from prod)
    speaking/*.md       # Talk metadata → /speaking/[slug]/
    work/*.md           # Career entries → /work/[slug]/
    topics/*.md         # Curated topic hubs → /topics/[slug]/
  layouts/
    PageLayout.astro    # Standard pages; pass full SEO title (no auto suffix)
    ArticleLayout.astro # Articles: ToC, author bio, related, BlogPosting schema
    TalkLayout.astro    # Talk detail pages + Event schema
    WorkLayout.astro    # Work detail pages
    TopicLayout.astro   # Topic hub pages + CollectionPage schema
  lib/seo.ts            # Schema helpers (Person, WebSite, Article, Event, CollectionPage, Breadcrumb)
  lib/related.ts        # resolveArticleLinks, resolveTalkLinks, resolveWorkLinks, excerpt()
  components/RelatedLinks.astro  # Cross-link footer blocks on detail pages
  pages/
    index.astro         # Homepage + Person/WebSite JSON-LD
    articles/[...slug].astro
    speaking/[...slug].astro
    work/[...slug].astro
    topics/[...slug].astro
    topics/index.astro
    rss.xml.ts          # RSS feed (published articles only in prod)
    robots.txt.ts
  consts.ts             # SITE metadata, HOME/WORK/SPEAKING/ARTICLES/TOPICS SEO titles
  styles/global.css     # Semantic tokens, motion, article-reveal system
public/og-default.png   # Default social preview image (1200×630)
```

## Content conventions

### Articles (`src/content/articles/*.mdx`)

Frontmatter schema:

```yaml
title: "..."
description: "..."   # Used in meta, RSS, listings (~150 chars)
date: "YYYY-MM-DD"
draft: false         # true = dev-only, excluded from build/sitemap/RSS in prod
tags: ["topic"]
related: []          # Optional slugs; falls back to 2 most recent
```

Import components at top of MDX:

```tsx
import { Callout } from "../../components/articles/Callout";
import { PullQuote } from "../../components/articles/PullQuote";
// … etc.
```

**Published articles (prod):** `code-freeze-purpose`, `rebuilding-fraud-prevention-at-n26`.

### Speaking (`src/content/speaking/*.md`)

Each talk has a detail page at `/speaking/<slug>/` (slug = filename without `.md`).

```yaml
event: "KotlinConf"
title: "Optional talk title"          # H1 when set; event becomes subtitle
date: "05/23/2024"
location: "Copenhagen, Denmark"
link: "https://..."                   # External recording — verify 200 before ship
description: "..."                    # Meta description override (~150 chars)
relatedArticles: [article-slug]
relatedTalks: [other-talk-slug]
relatedWork: [work-slug]
```

Body markdown = unique page content (required for SEO — not frontmatter-only).

Verify external links before shipping. Sessionize profile (`https://sessionize.com/rafaelroman`) is the canonical speaker hub. KotlinConf 2024: `https://2024.kotlinconf.com/talks/551172/` (Sessionize slug 404'd).

### Work (`src/content/work/*.md`)

Each entry has a detail page at `/work/<slug>/` (slug = filename, e.g. `n26`).

```yaml
company: "N26"
role: "Principal Engineer"
dateStart: "11/01/2019"
dateEnd: "01/01/2024"                 # or "Present"
relatedArticles: [article-slug]
relatedTalks: [talk-slug]
```

Body markdown = career narrative on the detail page. List views link company name → detail page.

### Topics (`src/content/topics/*.md`)

Curated hub pages at `/topics/<slug>/` — **not** auto-generated tag spam.

```yaml
title: "Fraud Prevention"
description: "..."                    # Meta + hero subtitle
relatedArticles: [slug]
relatedTalks: [slug]
relatedWork: [slug]
```

Body must include an **original intro paragraph** (100+ words) explaining why this cluster exists. Link only content with genuine overlap. Current hubs: `fraud-prevention`, `stream-processing`, `engineering-leadership`, `fintech-infrastructure`, `energy-tech`.

**Do not** create `/articles/tag/[tag]/` until 3+ articles share a tag.

## Article components

Reuse before inventing new ones. All live in `src/components/articles/`:

| Component | Use for |
|-----------|---------|
| `Callout` | note / warning / tip / info asides |
| `PullQuote` | Standout quotes |
| `Timeline` | Dated sequences (latency, history) |
| `Compare` | Before/after columns |
| `MetricRow` | Key numbers in a row |
| `SignalList` | Bulleted list with lime marks |
| `FlowDiagram` | Step pipeline |
| `ScoreThreshold` | Threshold / score bars |
| `Pipeline` | Linear process stages |
| `Checklist` | Action lists |
| `LessonStack` | Stacked takeaways |

New article components: React + Tailwind, use semantic classes (`.text-prose`, `.text-heading`, `.text-meta`, `.text-accent`, `.border-subtle`). Add `article-reveal` for scroll animation; see motion pitfalls below.

## Design rules (short)

Full spec: **DESIGN.md**. Non-negotiables:

- **Semantic tokens** — prefer `.text-heading`, `.text-prose`, `.text-meta`, `.text-accent`, `.border-subtle`, `.bg-surface-muted` over raw `text-zinc-*` / `text-lime-*`.
- **Signal mark** — one `.signal-mark` per page hero only.
- **Flat surfaces** — no box shadows; 1px borders for separation.
- **Touch & a11y** — `.touch-target`, `.focus-ring`, 44px min targets, WCAG AA in both themes.
- **Voice** — direct, no portfolio clichés, no VC-bro hype (see PRODUCT.md).

Page titles in `consts.ts` are **full SEO strings** (e.g. homepage title already includes name — `PageLayout` does not append `| Rafael Roman`).

## SEO & programmatic pages

**Strategy:** Personal brand first; detail pages and topic hubs compound topical authority without thin-content pSEO. Quality over quantity — every programmatic page needs unique body copy and 2+ internal links.

### URL architecture (subfolders)

```
/                           Person + WebSite
/articles/<slug>/           BlogPosting
/speaking/<slug>/           Event
/work/<slug>/                Breadcrumb (company profile)
/topics/                    Hub index
/topics/<slug>/              CollectionPage + ItemList
```

~24 indexable pages today. Sitemap auto-generated via `@astrojs/sitemap`.

### Title patterns

| Page | Pattern |
|------|---------|
| Homepage | Full string in `HOME.TITLE` (no suffix added) |
| Section hubs | Full string in `WORK` / `SPEAKING` / `ARTICLES` / `TOPICS` |
| Article | `{title} \| Rafael Roman` |
| Talk | `{title or event} · {event} · Rafael Roman` |
| Work | `{role} at {company} · Rafael Roman` |
| Topic | `{title} · Topics · Rafael Roman` |

### Meta & social (`Head.astro`)

- Default OG image: `/og-default.png` on every page
- RSS alternate: `/rss.xml`
- Articles: `og:type=article`, `article:author`, `article:tag`
- JSON-LD via `jsonLd` prop → `JsonLd.astro`

### Schema by page type (`src/lib/seo.ts`)

| Helper | Used on |
|--------|---------|
| `personSchema` + `webSiteSchema` | Homepage |
| `articleSchema` + `breadcrumbSchema` | Articles |
| `eventSchema` + `breadcrumbSchema` | Talks |
| `breadcrumbSchema` | Work |
| `collectionPageSchema` + `breadcrumbSchema` | Topics |

### Internal linking (`src/lib/related.ts`)

Detail pages resolve `relatedArticles`, `relatedTalks`, `relatedWork` frontmatter slugs → `RelatedLinks.astro` footer blocks. When adding content:

1. Set related slugs on the new entry
2. Add reverse links on related entries (bidirectional where sensible)
3. Update topic hub slug arrays if the content fits a cluster

Entry components (`TalkEntry`, `WorkEntry`, `ArticleEntry`) link list items to detail pages.

### pSEO don'ts

- No city/location doorway pages ("speaker in Basel")
- No tag archives with fewer than 3 articles
- No frontmatter-only pages (empty markdown body)
- No keyword-stuffed titles; match PRODUCT.md voice
- Verify external talk URLs return 200

### Draft exclusion

Prod build filters `draft: true` articles from routes, sitemap, RSS, and homepage. Dev shows drafts.

**Post-deploy:** Submit `https://rafaelroman.com/sitemap-index.xml` in Google Search Console after meaningful releases.

## Motion system

| Class | Scope |
|-------|--------|
| `.animate-hero` | Page hero blocks only — fade/slide on load |
| `.article-reveal` | Article components — scroll-triggered via IntersectionObserver in `Head.astro` |
| `.article-stagger` | Stagger children (`.article-stagger-item`) |

**Pitfall:** If both `article-reveal` and `article-stagger` are on the **same** element, CSS requires `html.reveal-ready .article-reveal.show.article-stagger > .article-stagger-item` (fixed for `SignalList` empty-square bug). Prefer nesting: parent `article-reveal`, child `article-stagger`.

Content must be **visible without JS** (`prefers-reduced-motion` disables reveals). Never gate article body on animation.

## Validation (required)

**Always validate UI changes in the browser** before reporting done (`pnpm dev` → navigate affected URLs). Check light and dark theme when touching colors or layout.

Minimum checks after visual or SEO changes:

1. Homepage `/`
2. One article (e.g. `/articles/code-freeze-purpose/`)
3. One talk detail (e.g. `/speaking/kotlinconf-2024/`)
4. One topic hub (e.g. `/topics/fraud-prevention/`)
5. `/speaking/` or `/work/` if list entries changed

Run `pnpm build && pnpm lint` before ship.

## Deploy & CI

- Branch: **`master`** → GitHub Pages at `rafaelroman.com`
- Workflow: `.github/workflows/deploy.yml` (uses `npm ci` + `npm run build`)
- Local dev uses **pnpm**; CI uses npm — keep `package-lock.json` in sync when changing deps
- After push: confirm [Actions](https://github.com/Panthro/panthro.github.io/actions) green, spot-check live URLs

## Ship workflow

1. `pnpm build && pnpm lint`
2. Browser-spot-check key pages (see Validation above)
3. Commit to `master` → wait for Deploy workflow
4. Verify live URLs + sitemap count

Do **not** commit `.impeccable/critique/` snapshots (local design review cache).

## Known backlog / next iterations

- [ ] Google Search Console verification + sitemap submit
- [ ] Analytics (none yet)
- [ ] Tag archive pages when article count grows (3+ per tag)
- [ ] Per-article OG images (optional)
- [ ] Dependabot npm vulnerabilities (11 on repo)

## Impeccable design skills

This site was refined with the Impeccable skill chain: `/critique` → `/audit` → `/colorize` → `/adapt` → `/bolder` → `/polish` → `/document` → `/animate`. Use those skills for future visual passes; critique snapshots land in `.impeccable/critique/` (gitignored).
