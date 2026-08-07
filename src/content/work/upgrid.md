---
company: "Upgrid"
role: "Co-founder & CTO"
dateStart: "01/01/2025"
dateEnd: "Present"
relatedArticles:
  - building-upgrid
---

Co-founded Upgrid as CTO in January 2025. Swiss energy reform opened a window for Lokale Energiegemeinschaften; the job was never "build an app." It was build the platform where grid metering data becomes allocation, invoices carry Swiss QR-bill references, and a wrong VAT line is an accounting problem — the same financial correctness bar I held at N26, in a different domain.

Built the technical foundation from scratch: SDAT ingestion, fifteen-minute consumption allocation, billing engine, QR-bill PDF generation, Bexio sync, and operator workflows for community formation and exception handling. The platform serves consumers, full operator accounts, co-brand partners (municipalities and installers who bring members while Upgrid operates the communities), and affiliates — each with different permissions on the same monorepo. Product scale today: 2k+ members, 250+ communities, 150+ municipalities.

Deliberate architecture for a small team: 37-package monorepo with shared Postgres schema and RLS multi-tenancy — the opposite call from N26's ~200-service estate, driven by team size and real coupling. Invested in engineering multipliers rather than raw feature count: infrastructure as code for Better Stack monitors and PostHog feature flags, CI ratchets on layered data access, metrics-as-code, a company brain agent so ops answers questions without interrupting engineering, and guardrails that make AI-assisted delivery safe to merge. Shipped bill-upload LLM pre-fill in consumer onboarding.

Also own product and go-to-market when the bottleneck is clarity: savings calculator, LEG explainer content, co-brand and affiliate landing pages, multi-channel acquisition, and signup instrumentation in PostHog — built like production software, not bolted on after launch.
