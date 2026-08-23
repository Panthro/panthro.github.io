---
company: "Upgrid"
role: "Co-founder & CTO"
dateStart: "01/01/2025"
dateEnd: "Present"
relatedArticles:
  - building-upgrid
  - engineering-at-upgrid-tech-stack
---

Co-founded Upgrid in January 2025 and wrote the first commit. As CTO I own architecture and delivery, and take product and go-to-market when clarity is the bottleneck rather than code.

**Built:** SDAT metering ingestion, fifteen-minute consumption allocation, a billing engine with Swiss QR-bill PDF generation, Bexio accounting sync, and operator workflows for community formation and exception handling. One codebase serves consumers, full operator accounts, co-brand partners (municipalities and installers who bring members while Upgrid runs the communities), and affiliates, each on different permissions.

**Architecture:** seven apps and ~70 workspace packages in a monorepo on a shared Postgres schema with row-level-security multi-tenancy. Sized for a small team, and the opposite call from the roughly 200-service estate I came from at N26.

**Scale today:** 2k+ members, 250+ communities, 150+ municipalities.

The company story is in [Building Upgrid](/articles/building-upgrid/). The stack tour — apps, metering, allocation, billing, delivery — is in [Engineering at Upgrid](/articles/engineering-at-upgrid-tech-stack/).
