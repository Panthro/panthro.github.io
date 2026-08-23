# Site Review — rafaelroman.com

Review date: 2026-08-11. Scope: structure, IA, home, every section, content voice, UI/design system, SEO/AEO.

---

## 0. The verdict up front

The engineering is good. The typography, the lime signal-mark, the mono/sans/display split, the a11y scaffolding (skip links, `focus-ring`, `touch-target`, reduced-motion branches) — all of it is above the bar for a personal site.

**Three things are holding it back:**

1. **The articles read as machine-generated, and the tell is structural, not lexical.** On `/articles/building-upgrid`, **72% of the article's rendered height is custom infographic components** and 28% is prose (measured in-browser: 4,747px of `not-prose` blocks vs 1,801px of paragraphs). All 7 articles use the same 8-component vocabulary in nearly the same order, and 6 of 7 end with `LessonStack` → `PullQuote`. A reader who opens two of them sees the template.

2. **There is no way to contact you and no evidence you are a person.** Zero `mailto:` anywhere in `src/`. Zero images — no photo, no logo, nothing. PRODUCT.md says success is *"a new visitor can answer who is this person, why does it matter, and **how do I reach them** in under 60 seconds."* The third one currently fails.

3. **"Rafael Roman" is a contested name and you are not winning it.** A bare `"Rafael Roman"` search returns a Green Bay photographer, a Moody's MBA, an Apple Music artist, a Puerto Rican education secretary, and a North Central College wrestler — your site is not in the top 10. You *do* rank for `"Rafael Roman" Upgrid CTO N26` (position 3). The gap is an entity-disambiguation problem, and it is fixable with the schema/`sameAs` work in §8.

---

## 1. Structure & information architecture

### Current shape

```
/                 home (hero + 3 work + 3 articles + socials)
/work             6 entries → /work/[slug]
/journey          scroll-driven map, 17 landmarks
/articles         7 posts → /articles/[slug]
/speaking         8 talks → /speaking/[slug]
/topics           5 hubs → /topics/[slug]     ← ORPHANED
/404, /rss.xml, /robots.txt, sitemap
```

### Problems

**`/topics` is orphaned.** Nothing in `src/components/Header.astro` or `src/components/Footer.astro` links to it. The only inbound links are `BackToPrev` inside `TopicLayout` (which you can only reach if you're already there) and `resolveTopicLinks` in `src/lib/related.ts` — which **is never called by any page**. So five hand-written hub pages, the single best-shaped SEO asset on the site, receive zero internal link equity and zero human traffic. This is the highest-ROI fix on the list.

**Article tags are dead pixels.** `ArticleEntry.astro:32` and `ArticleLayout.astro:113` render `#energy-tech`, `#flink`, `#kotlin` as plain `<span>`s. They link nowhere. Meanwhile `/topics/*` exists and covers roughly the same ground. Tags and topics are two uncoordinated taxonomies:

| Tag used in articles | Matching topic page? |
|---|---|
| `engineering-leadership` | ✅ |
| `energy-tech` | ✅ |
| `fintech-infrastructure` | ✅ |
| `fintech` | ❌ (near-dupe of the above) |
| `flink`, `kafka` | ❌ (both belong to `stream-processing`) |
| `distributed-systems`, `architecture`, `kotlin`, `kubernetes`, `tdd`, `testing`, `code-quality`, `devops`, `risk-management`, `company-culture`, `psychological-safety`, `platform-engineering`, `career`, `bootcamp`, `interviewing` | ❌ |
| — | `fraud-prevention` topic exists but **no article carries that tag** |

**Recommendation:** collapse to one taxonomy. Keep `topics` as the canonical set (5–8 hubs). Make `tags` in article frontmatter a controlled vocabulary validated against the topics collection via Zod. Render tags as links to `/topics/<slug>/`. Add `topics` to the header nav (or at minimum the footer). Auto-derive each topic page's related-articles list from tags instead of maintaining it by hand in frontmatter.

**Missing pages that would earn their place:**

- **`/about`** — this is the page that ranks for your name. Long-form first person, a photo, birthplace/nationality, education, the three-country arc, what you're doing now, and a direct contact route. Right now the home page tries to be hero + résumé + blog index at once, and the "who is this human" job falls through.
- **`/contact`** or at minimum a `mailto:` in the footer and hero. Currently an investor's only route is LinkedIn DM.
- **`/speaking` needs a "book me" block** — you have TEDx, Kafka Summit, KotlinConf, WeAreDevelopers. Conference organizers land on `/speaking` and there's nothing to do. Add: topics you speak on, formats, a headshot link, a one-line bio to copy, and an email.

**Nav labels:** the header says `work / journey / writing / talks` but the pages are titled `Work / A path from São Paulo to Basel / Writing / Talks` and live at `/work /journey /articles /speaking`. Three of four have a URL that doesn't match its label. Not fatal, but `writing → /articles` and `talks → /speaking` cost you exact-match anchor text. Either rename the routes or accept it — just don't leave it accidental.

---

## 2. Home screen

`src/pages/index.astro`

### What works

The hero hierarchy is right: name → role + company → the 20-year credential line in muted grey. The `signal-mark` scale-in is a nice, restrained entrance. The 60-second job is *mostly* done.

### What doesn't

**Three consecutive paragraphs of body copy set in JetBrains Mono at `text-sm`.** Lines 40–61. That's ~130 words of prose in a monospace face at 14px. Mono is a labeling face — it works for the `Speaker:` line and the dates. For three dense paragraphs it fights the reader, and the first one is the worst offender:

> "Upgrid is regulated energy infrastructure: SDAT ingestion, allocation, Swiss QR-bill billing, and operator workflows for ZEV, LEG, and vZEV communities — full operators, co-brand partners (municipalities and installers), and affiliates on one codebase. 2k+ members, 250+ communities, 150+ municipalities."

Six acronyms (SDAT, ZEV, LEG, vZEV, QR-bill, CTO) in one sentence, none defined. An investor reads that as noise; a senior engineer reads it as a spec sheet. **Fix:** set these in Inter at `text-base`, and split the Upgrid paragraph into one plain-English sentence + a metric row. Reserve mono for the `Speaker:` line and metadata.

**The metrics are buried in a sentence.** `2k+ members, 250+ communities, 150+ municipalities` is your single strongest credibility signal and it's the tail of a comma-list in 14px mono. Promote it to a three-cell stat row. You already have a `MetricRow` component — this is the one place on the site where it genuinely belongs.

**No face, no contact, no CTA.** The "Connect" section at the bottom is a slash-separated list of four lowercase words (`linkedin / github / stackoverflow / sessionize`) preceded by *"Interested in distributed systems, fintech, energy tech, or engineering leadership? Find me on:"* — a question the visitor didn't ask, answered with a link list. Replace with a real close: a sentence about what you want to hear about, an email address, and the social row as secondary.

**Section spacing is uniform and rhythmless.** `space-y-28` between all four sections. Hero → Work → Writing → Connect all get identical air, so nothing reads as more important than anything else. Give the hero a larger trailing gap and tighten Work/Writing.

**No `/journey` or `/topics` surface.** Journey gets one text link buried at the end of the muted grey paragraph ("Walk the journey →"). It's the most distinctive thing on the site and it's the least visible link on the home page.

---

## 3. `/work`

`src/pages/work/index.astro`, `src/components/WorkEntry.astro`

Clean and correct. Reverse-chronological, six entries, each with a date range, company, role, and a paragraph.

**Issues:**

- **Date formatting is locale-dependent and currently renders wrong.** `src/lib/utils.ts:8` uses `startDate.toLocaleString("default", { month: "short" })`. `"default"` resolves to the *build machine's* ICU locale. On the dev box it renders `"jan. 2025"` (lowercase, trailing period — a Romance-language abbreviation) instead of `"Jan 2025"`. In CI it happens to be `en-US`, so prod is fine *by accident*. Hard-code `"en-US"`. One-line fix, `src/lib/utils.ts:8` and `:19`.
- **Truncation is invisible.** `truncate` on the home page applies `line-clamp-3` with no "…" or "read more" affordance. The text just stops. Add an ellipsis or a `→` on the company link.
- **The `<article>` tag inside `<li>`** (`WorkEntry.astro:26`) inherits the global `article { @apply prose … prose-headings:text-white }` rule from `global.css:75`. That's a full typographic ruleset applied to a three-line blurb. It works today but it's a trap for the next person who puts a heading in a work entry.
- **No outcomes, only scope.** Compare Personio ("Defined technical direction for core platform services, shaped engineering standards, and operated as a cross-team technical authority at scale") against N26 ("replaced a static rule engine … with a real-time Apache Flink streaming system in under six months"). The N26 entry has a verb, an object, and a clock. Personio, GFT, and IBM don't — they're LinkedIn-headline abstractions. **"Operated as a cross-team technical authority at scale" is the single most AI-sounding sentence on the site.** Every entry needs at least one falsifiable fact.

---

## 4. `/journey`

`src/pages/journey/index.astro`, `src/components/journey/JourneyWorldMap.tsx`, `src/lib/journey-scroll-spy.ts`

The most ambitious page and the most distinctive. Sticky world map, scroll-linked active pin, chapter nav, 17 landmarks. Genuinely rare — it does not look like other portfolio sites, which is exactly what PRODUCT.md asks for.

**Issues:**

- **The map projection wastes half its area on the Atlantic.** At desktop, roughly 45% of the visible map is ocean and West Africa, because the bounding box has to contain São Paulo and Basel. The three regions that carry information (Brazil, Iberia, Switzerland) are three small clusters at the edges. Consider three chapter-scoped views that cross-fade as you scroll — regional Brazil → Iberia → Switzerland — instead of one global frame. That also makes the individual pins legible, which they currently aren't at world zoom.
- **Every landmark is visually identical.** `JourneyStep.astro` renders a bordered card with a mono kind-label, a mono date, a title, and a summary — 17 times. The only differentiation is `font-size` by kind (`global.css`, `.journey-step--career .journey-step-title` etc.), which is subtle enough that a reader won't register it as a system. Seventeen identical rectangles is a list, not a story.
- **`startJourneyScrollSpy()` runs `requestAnimationFrame` forever.** `src/lib/journey-scroll-spy.ts:47-62` calls `pickActiveStepIndex()` on every frame, which calls `getBoundingClientRect()` on all 17 step nodes → a forced synchronous layout **60×/second for as long as the tab is open**, whether or not the user is scrolling. Gate it on a `scroll` listener + `requestAnimationFrame` coalescing, or bail when `document.hidden`. Also: the returned teardown function is discarded at the call site (`journey/index.astro`, the inline `<script>`), so with `ClientRouter` view transitions you can accumulate multiple concurrent rAF loops across navigations.
- **Deep links arrive on a blank frame.** `.journey-step` gets `.article-reveal`, and `html.reveal-ready .journey-step { opacity: 0 }` until an IntersectionObserver adds `.show`. Landing on `/journey#chapter-switzerland` (which the page's own sticky nav links to) puts you at scrollY ≈ 5200 with the surrounding steps at opacity 0.18 and climbing — a ~650ms fade before anything is readable. Fine as a scroll effect; wrong as an arrival state. Skip the reveal for elements already in or above the viewport on first paint.
- **The intro lede repeats the home page's framing.** *"Twenty years of building systems where a bug is someone's money"* vs. the home page's *"20+ years engineering critical infrastructure"* vs. the Upgrid work entry's *"a wrong VAT line is an accounting problem"* vs. the `building-upgrid` article's *"a wrong VAT line is a customer complaint and an accounting problem."* See §6.

---

## 5. `/articles`, `/speaking`, `/topics`, `/404`

**`/articles` index** — a bare `<h1>Writing</h1>` and a list. No intro line explaining what you write about, no filtering, no reading times (they're computed in `[...slug].astro:63` but only shown on the detail page). At seven posts a flat list is fine; add a one-sentence positioning line and surface reading time and topic in the row.

**`/speaking`** — the best-executed index page. Year grouping, `kind` badges, external links, `excerpt()` fallback for missing descriptions. Two gaps: `javacro-2024.md` and `wearedevelopers-world-congress-2024.md` have no `title` and generic bodies ("Session on modern backend architecture and distributed systems in the JVM ecosystem" / "Session on engineering at scale from the trenches") — placeholder text that reads as filler next to the KotlinConf and Kafka Summit entries. And as noted, no booking CTA.

**`/topics`** — good pages, invisible. The bodies are strong (`fraud-prevention.md`, `stream-processing.md` in particular read like a human wrote them). See §1.

**`/404`** — fine. Add a search or a "recent writing" list; a link list of five items the visitor already saw in the nav is a wasted page.

---

## 6. AI slop — text

This is the part worth acting on. The prose isn't *bad* — it's **patterned**, and the patterns are the ones LLMs reach for.

### The antithesis tic

The construction `X isn't Y — it's Z` (or `not Y. Z.`) appears **9+ times across 7 articles** and again in the topics, the work entries, and the home page:

- `"Fraud prevention isn't a nice-to-have — it's a regulatory obligation"` (fraud article)
- `"Backups aren't an infra metric — they're a recovery guarantee"` (N26 stack)
- `"Kotlin isn't a developer convenience — it's a maintenance strategy"` (N26 stack)
- `"Runbooks aren't afterthoughts — they're …"` (N26 stack)
- `"The problem isn't the freeze itself — it's …"` (code freeze)
- `"The cost isn't small — it's …"` (say yes first)
- `"Improv isn't corporate cringe here — it's a forcing function"` (say yes first)
- `"Psychological safety isn't comfort. It's the ability to be wrong in public"` (say yes first)
- `"Financial crime prevention at a neobank is not a rules engine problem — it is a latency, data, and organizational problem"` (fraud-prevention topic)
- `"the hard part isn't marketing solar panels — it's the platform behind them"` (energy-tech topic)
- `"Local energy is a systems, regulation, and go-to-market problem — not a landing page"` (building-upgrid)
- `"Community energy isn't CRUD"` (building-upgrid)
- `"Team size and actual coupling decide topology. Not fashion."` (building-upgrid)

**Budget: one per article, maximum.** It's a good move used once. Used thirteen times it becomes a signature.

### The two-beat closer

Nearly every section ends on a short declarative fragment that reframes the paragraph above it:

> "The pattern is." · "It also compounds." · "Not fashion." · "The numbers vary by study. The direction doesn't." · "That's cheap. Training Alex never to speak again is expensive." · "That's worse." · "The difference lands."

Individually these land. Twenty of them in a row is a metronome. Cut half; let some sections end on a normal sentence.

### Em-dash density

19–36 em dashes per article (avg. 27 across ~1,700 words ≈ one every 60 words). Roughly half are doing parenthetical work that a comma or a full stop would do better, and heavy em-dash use is now one of the most recognizable LLM fingerprints. Target: cut by 60%.

### Unsourced authority

`say-yes-first-platform-teams.mdx:125-143` cites *"Research on collaborative cultures consistently finds the same shape"* with no source, then renders a `MetricRow` whose three "metrics" are `#1`, `↑`, and `↓` with labels like *"Idea-sharing cultures report materially higher innovation output."* An arrow is not a metric. This is a data-visualization component being used as decoration around a claim you can't back — the exact opposite of PRODUCT.md's *"earns authority through content and structure."* Either cite Edmondson and Project Aristotle properly with links, or drop the component and make the argument in prose from your own experience, which is the stronger source anyway.

### The Upgrid story is told four times in the same words

| Location | Phrasing |
|---|---|
| `index.astro:44` | "SDAT ingestion, allocation, Swiss QR-bill billing, and operator workflows for ZEV, LEG, and vZEV … 2k+ members, 250+ communities, 150+ municipalities" |
| `work/upgrid.md` | "the job was never 'build an app.' It was build the platform where … a wrong VAT line is an accounting problem" |
| `articles/building-upgrid.mdx` | "The job wasn't 'build an app.' … a wrong VAT line is a customer complaint *and* an accounting problem" |
| `topics/energy-tech.md` | "Metering data arrives on grid schedules. Allocation runs on fifteen-minute intervals. Invoices carry Swiss QR-bill references" |

Same facts, same sentence architecture, four URLs. Readers who click two of them notice. Search engines see near-duplicate content across your own domain. **Fix:** pick one canonical telling (the article), and let the other three be *pointers* with genuinely different angles — the work entry is the résumé fact, the topic hub is the landscape, the home page is the one-line hook.

### What to keep

The best writing on the site is the stuff with a specific memory in it: *"three small purchases in Berlin, then a large ATM withdrawal in Lagos two hours later, then a card-not-present transaction in Singapore"* · *"a prayer that the new rule didn't break the old ones"* · *"you've built a bottleneck with a personality attached"* · the whole `n26-berlin-tech-stack-meetup-2022.md` entry. Write more like that and less like the component blocks.

---

## 7. AI slop — structure & UI

### The MDX component library is the loudest tell

Fourteen components in `src/components/articles/`. Here is what each article actually uses, in order:

| Article | Component sequence |
|---|---|
| building-upgrid | PullQuote → Callout → SignalList → Compare → FlowDiagram → Callout → SignalList → Compare → Pipeline → Compare → Callout → MetricRow → Pipeline → Compare → **LessonStack → PullQuote** |
| rebuilding-fraud-prevention | PullQuote → Callout → Compare → SignalList → FlowDiagram → Timeline → ScoreThreshold → MetricRow → Pipeline → Callout → **LessonStack → PullQuote** |
| code-freeze-purpose | PullQuote → Callout → FlowDiagram → SignalList → FlowDiagram → Timeline → MetricRow → Compare → Callout → **LessonStack** → Checklist → Callout → PullQuote |
| say-yes-first | ScenarioFork → PullQuote → FlowDiagram → Compare → SignalList → MetricRow → Checklist → Callout → PullQuote → **LessonStack** → Callout |
| straight-out-of-the-bootcamp | FlowDiagram → Compare → SignalList → PullQuote → Checklist → Callout → Pipeline → ExperienceMatrix → Checklist → **LessonStack** → Callout |
| engineering-at-n26 | Callout → StackLayers → MetricRow → PullQuote → Timeline → Pipeline → SignalList → FlowDiagram → Compare → **LessonStack** → Callout |
| i-hardly-debug-anymore | Compare → PullQuote → Pipeline → FlowDiagram → SignalList → Callout → Checklist → **LessonStack** → Callout |

Seven articles. Same eight core components. **Every single one ends with `LessonStack`** — six of them titled some variant of *"What I'd do differently."* `Compare` (before/after two-column) appears in all seven. This is a template, and the template is visible from the second article onward.

**And it dominates the page.** Measured on `/articles/building-upgrid` at 1280×800: article height 7,924px, of which **4,747px (72%) is `not-prose` component blocks**. The reader scrolls twelve screens and spends nine of them looking at bordered boxes.

**Recommendation — this is the biggest single improvement available:**

1. **Cap it at 2–3 custom blocks per article.** Pick the one that carries information the prose genuinely can't: the `Timeline` (T+0ms → T+52ms) in the fraud article is *excellent* — it shows a latency budget you can't express in a sentence. The `FlowDiagram` for SDAT → Allocation → Billing → QR-bill → Bexio is excellent. Keep those.
2. **Delete `Compare` from most articles.** A two-column before/after list is almost always a paragraph that got put in a box. In `building-upgrid` there are *four* of them. Three should be prose.
3. **Delete `LessonStack` as a universal closer.** "What I'd do differently" as a mandatory final section in every post is the most obvious template artifact on the site. Keep it where you have real regrets (the fraud article's "we built the risk engine first and then added monitoring — that was backwards" is genuine); drop it elsewhere.
4. **Retire `MetricRow` when you don't have metrics.** `#1 / ↑ / ↓` is not a metric row.
5. **Vary the opening.** Five of seven articles open with a scene-setting paragraph followed by a `PullQuote` in the first screen. Let some start cold.

### Design-system observations

- **`.text-prose` and `.text-meta` are byte-identical.** `global.css:96-102` — both resolve to `text-zinc-600 dark:text-zinc-400`. So dates, captions, tags, and body copy all sit at the same weight, and there is no tertiary tier in the type system. Meta should be one step down (`zinc-500 dark:zinc-500`). Right now the hierarchy exists in the class names but not on screen.
- **`Link.astro` uses `inline-block`.** `src/components/Link.astro:16`. Inline-block links inside flowing prose can't break across lines and sit on a different baseline than surrounding text. Visible on the home hero ("Upgrid", "Walk the journey →") and in the `/speaking` intro ("Sessionize"). Should be `inline`.
- **Five preloaded font files.** `Head.astro:26-30` preloads Bricolage variable + Inter 400/600 + JetBrains Mono 400/600. That's five high-priority requests competing with LCP when only two are needed above the fold. Preload Bricolage + Inter 400; let the rest load normally.
- **`public/fonts/` contains 5 unreferenced font files** — `MonaSans-{Regular,Light,SemiBold}.woff2`, `atkinson-{bold,regular}.woff`. Nothing in `src/` references them. Leftover from the Astro Nano template. Delete.
- **`public/safari-pinned-tab.svg` is 404 KB.** A Safari mask icon is supposed to be a single monochrome vector path measured in kilobytes. Something went wrong exporting it — and it isn't even referenced in `Head.astro`, so it's 404 KB of dead weight in the deploy.
- **The web manifest is never linked.** `public/site.webmanifest` exists; `Head.astro` has no `<link rel="manifest">` and no `<meta name="theme-color">`. Same for `browserconfig.xml`, `favicon-32x32.png`, `favicon-16x16.png`, `mstile-150x150.png` — all shipped, none referenced.
- **The theme toggle is three separate icon buttons in the footer.** Light / dark / system as three 44px targets with no indication of which is active. A single cycling button, or three with an active state, would read better — and it belongs in the header, where people look for it.

---

## 8. SEO

### Confirmed working

- Canonical URLs, OG, Twitter card, RSS, `robots.txt` with sitemap reference — all correct.
- Sitemap live with 32 URLs.
- JSON-LD: `Person` + `WebSite` on home, `BlogPosting` + `BreadcrumbList` on articles, `Event` + breadcrumb on talks, `CollectionPage` + breadcrumb on topics. Better than most personal sites.
- You rank **#3** for `"Rafael Roman" Upgrid CTO N26`.

### Bugs

**Every internal article link 301-redirects.** `ArticleEntry.astro:25` emits `href="/articles/${slug}"` (no trailing slash) but Astro builds directory-format output. Verified live:

```
https://rafaelroman.com/articles/building-upgrid   → 301 → .../building-upgrid/
```

The home page, `/articles` index, and the "More writing" block in `ArticleLayout.astro:141` all use the short form. `resolveArticleLinks()` in `related.ts` correctly uses the trailing slash. So the same URL is linked two ways from within your own site. Every article click on the site burns a redirect hop and splits internal PageRank. **Fix: add the trailing slash in `ArticleEntry.astro:25` and `ArticleLayout.astro:141`.**

**A published article links to a dead page on your own domain.** `straight-out-of-the-bootcamp.mdx:251` links to `https://rafaelroman.com/2021/08/09/out-of-bootcamp/` → **404**. That's the old WordPress permalink.

**Which raises the bigger issue: the legacy WordPress URLs were never redirected.** `/2021/08/09/out-of-bootcamp/` and `/about/` both 404. Any backlink, bookmark, or residual ranking pointing at the old site is being thrown away. Astro supports static redirects on GitHub Pages via `redirects` in `astro.config.mjs` (emits meta-refresh + canonical HTML pages). Pull the old permalinks from the Wayback Machine or Search Console's "Pages → Not found (404)" report and map every one of them.

### The name problem

`"Rafael Roman"` is shared with at least five other public people. Winning it takes **entity consolidation**, not keyword work:

1. **Enrich `personSchema()`** (`src/lib/seo.ts:9-33`). Currently missing everything Google's Knowledge Graph uses to build an entity:
   ```
   image           ← a real photo URL (you have zero images on the site)
   email
   address         ← PostalAddress, Basel, CH
   birthPlace      ← São Paulo, BR
   nationality
   alumniOf        ← FATEC
   homeLocation
   award / hasOccupation
   ```
2. **Expand `sameAs`.** Currently 4 profiles (LinkedIn, GitHub, Stack Overflow, Sessionize). Add: Medium (`@panthro`), your TED talk page, the TEDxLleida speaker page, the Upgrid team page, Crunchbase, X/Bluesky if you have them, Confluent's Kafka Summit speaker page, the KotlinConf and DevBCN session pages. `sameAs` is the single strongest disambiguation signal available to you.
3. **Use `ProfilePage` schema on the home page.** Google added `ProfilePage` specifically for creator/author identity. Wrap: `{ "@type": "ProfilePage", "mainEntity": { "@type": "Person", ... } }`.
4. **Build `/about`** and make it the strongest on-page target for the name — H1 "Rafael Roman", the full biography, the photo, and every `sameAs` link rendered as a visible outbound link (not just in JSON-LD).
5. **Get the name into third-party sources you control:** GitHub profile README, Medium bio, Sessionize bio, LinkedIn featured section, the Upgrid site's team page — all pointing at `rafaelroman.com` with consistent name/title/location strings. Consistency across sources is what makes an entity resolve.

### Other SEO fixes

- **One OG image for 32 pages.** `SITE.OG_IMAGE = "/og-default.png"`. Generate per-page OG images at build time (`astro-og-canvas` or a Satori route) with the title + your face. Article shares on LinkedIn/X are where most of your traffic will originate; a generic card halves the CTR.
- **No `dateModified` anywhere.** `articleSchema()` emits only `datePublished`. Add a `updated` field to the content schema and emit `dateModified` — freshness is a real ranking input for evergreen technical content.
- **Sitemap has no `lastmod`.** Configure `@astrojs/sitemap` with `serialize` to add it.
- **`Event` schema on 8 past talks.** All dates are in the past; Google can flag past events. Add `endDate`, and consider `eventStatus: EventScheduled` + `VideoObject` for the ones with recordings (TEDx, KotlinConf, Kafka Summit).
- **Inconsistent title separators:** `|` in `ArticleLayout` (`${title} | ${SITE.NAME}`), `·` in `consts.ts`, `—` inside titles. Pick one.
- **Missing `inLanguage`, `wordCount`, `articleSection`** on `BlogPosting`.
- **Medium duplicates.** Four articles were originally published on Medium and still live there. Medium has vastly more domain authority — it will outrank you for the same content. Use Medium's canonical import to point at your version, or unpublish the Medium originals and 301 them.
- **`/journey` has no `Person`/`Article` schema** — only `BreadcrumbList`. It's your most distinctive page; give it a real content type.

---

## 9. AEO — getting cited by AI answer engines

The site is unusually well positioned for this (clean semantic HTML, static, real facts, JSON-LD already in place) and is missing the last mile.

**1. Add `/llms.txt`.** Confirmed 404 today. A markdown index at the root: who you are in one paragraph, canonical URLs for each section, and the two or three claims you want repeated verbatim (`CTO & Co-founder of Upgrid`, `Principal Engineer at N26 2019–2024`, `speaker at Kafka Summit / KotlinConf / TEDx`). Cheap, and increasingly used.

**2. Explicitly allow AI crawlers in `robots.txt`.** Currently `User-agent: * / Allow: /` which permits them by default — but name them so the intent is unambiguous and future-proof: `GPTBot`, `ClaudeBot`, `anthropic-ai`, `PerplexityBot`, `Google-Extended`, `CCBot`, `Bytespider`, `Applebot-Extended`.

**3. Write answer-shaped content.** LLMs cite passages that directly answer a question in 2–4 sentences under a question-form heading. Your articles are structured as narrative with declarative H2s (`"The money path"`, `"Engineering multipliers"`, `"The honest part"`). Those are good literary headings and bad retrieval targets. Add a short FAQ block at the end of each article with real question headings:
   - *"How long does it take to ship a new fraud rule with Apache Flink?"* → "~2 weeks, versus 4 weeks to 6 months in the previous microservice architecture."
   - *"Should a small team use a monorepo or microservices?"* → the Upgrid answer, in three sentences.
   - *"What is a ZEV / LEG / vZEV in Swiss energy law?"* → you are one of very few English-language sources on this. **This is your single biggest untapped AEO opportunity** — near-zero competition, real search intent, and it maps directly to Upgrid's commercial interest.

**4. Add `FAQPage` schema** to those blocks, and `QAPage` where appropriate.

**5. Front-load the extractable claim.** The strongest AEO asset you have is the fraud rebuild — a specific, quotable, verifiable engineering outcome ("replaced a static rule engine spread across dozens of microservices with a stateful Apache Flink pipeline in six months; new rule lead time went from 4 weeks–6 months to ~2 weeks; payment-to-decision latency ~52ms"). Put that sentence, in that shape, in the article's opening paragraph, in its `description`, and in the `/topics/fraud-prevention` hub. Models extract from the top of the document.

**6. `speakableSpecification`** on the `Person` and key articles.

**7. Define your terms on first use.** `SDAT`, `ZEV`, `LEG`, `vZEV`, `QR-bill`, `RLS`, `CDKTF` appear across the site with no expansion. An LLM building an answer about Swiss energy communities can't safely cite a passage whose acronyms it can't resolve — and neither can a human investor.

**8. Fix the `#1 / ↑ / ↓` MetricRow.** Answer engines specifically penalize unverifiable statistical claims. Either source it or cut it.

---

## 10. Prioritized plan

### P0 — this week, high impact, low effort

1. Add a contact route: `mailto:` in the footer and a real close on the home page. *(PRODUCT.md's own success criterion.)*
2. Add a photo. Home + `/about` + `Person.image` in JSON-LD.
3. Fix the trailing slash in `ArticleEntry.astro:25` and `ArticleLayout.astro:141` — every article link on the site currently 301s.
4. Fix `dateRange()` locale: `"default"` → `"en-US"` (`src/lib/utils.ts:8,19`).
5. Fix the dead self-link in `straight-out-of-the-bootcamp.mdx:251`.
6. Link `/topics` from the header nav and make article tags link to topic hubs.
7. Set the home-page body paragraphs in Inter, not JetBrains Mono; promote `2k+ / 250+ / 150+` to a stat row.
8. Add `<link rel="manifest">` + `theme-color`; delete the 5 unused fonts and the 404 KB `safari-pinned-tab.svg`.

### P1 — this month, the real work

9. **Editorial pass on all 7 articles.** Cap custom components at 2–3 each (target: components ≤ 35% of page height, down from 72%). Kill `LessonStack` as a universal closer. Kill 3 of 4 `Compare` blocks in `building-upgrid`. Cut em dashes by 60%. Cap the `X isn't Y — it's Z` construction at one per piece.
10. Build `/about` — the page that wins your name.
11. Enrich `personSchema()` (image, email, address, birthPlace, alumniOf) and expand `sameAs` to 10+ profiles. Switch home to `ProfilePage`.
12. Per-page OG images at build time.
13. Redirect the legacy WordPress URLs via `astro.config.mjs` `redirects`.
14. De-duplicate the Upgrid story across home / work / article / topic — one canonical telling, three distinct pointers.
15. Rewrite the Personio, GFT, and IBM work entries with at least one falsifiable fact each.
16. Add `/llms.txt`, name AI crawlers in `robots.txt`, add FAQ blocks + `FAQPage` schema.
17. Add a booking block to `/speaking`.

### P2 — when there's room

18. Rework the journey map into three chapter-scoped regional views; differentiate landmark types visually.
19. Replace the journey rAF loop with a scroll-gated observer; skip reveal animations for content already in view on arrival.
20. Split `.text-meta` off `.text-prose` so the type system has a third tier.
21. Fix `Link.astro` `inline-block` → `inline`.
22. Move the theme toggle to the header with an active state.
23. Resolve the Medium duplicate-content situation.
24. Write the ZEV/LEG/vZEV explainer — lowest competition, highest AEO upside, directly serves Upgrid.
