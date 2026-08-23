---
title: "Energy Tech"
description: "Swiss local energy communities as an engineering domain — ZEV, LEG and vZEV models, metering data, allocation, and QR-bill billing."
relatedArticles:
  - building-upgrid
  - engineering-at-upgrid-tech-stack
  - shipping-at-upgrid
relatedTalks: []
relatedWork:
  - upgrid
# TODO(rafa): confirm exact definitions before expanding this section.
# This is the site's biggest untapped AEO opportunity (REVIEW.md §9.3) — near-zero
# English-language competition — but it is only worth having if it is right.
# Needed, one or two plain-English sentences each, from a source you trust:
# - ZEV   — full German expansion; what qualifies; single-building vs. multi-building;
# who owns the meter; who bills whom
# - LEG   — full German expansion; what the 2025 reform actually changed; the
# geographic / grid-level constraints on membership
# - vZEV  — full German expansion; how it differs from a plain ZEV in metering and settlement
# Then add a question-form heading ("What is a ZEV, LEG or vZEV in Swiss energy law?")
# and FAQPage schema so answer engines can lift it.
# Do not publish guessed regulatory detail: the credibility is the product.
---

Energy tech, on this site, means one specific thing: the software that has to exist before neighbours can buy each other's solar electricity in Switzerland. Not the panels, not the tariff comparison, and not the marketing site. The layer underneath, where a grid operator's metering file has to become a defensible invoice.

It is an unusual domain to build in. The inputs arrive on someone else's schedule and in someone else's format. The unit of work is a fifteen-minute interval, not a user action. The output is a legal document with tax consequences. And the rules differ by community model, so the same platform has to run three of them without pretending they are one workflow with three labels. Very little of that is visible to the member, who sees a signup form and a lower bill.

## ZEV, LEG and vZEV

Swiss energy law recognizes more than one way for a group of people to share locally produced electricity, and the differences are not cosmetic. ZEV, LEG (Lokale Energiegemeinschaft) and vZEV each carry their own metering, allocation and billing rules. The 2025 reform that opened Lokale Energiegemeinschaften is what made the market large enough to build a platform for. Upgrid supports all three models as distinct workflows.

## What is here

[Building Upgrid](/articles/building-upgrid/) is the founder story: who the platform serves, the money path at product level, applied AI, and go-to-market. [Engineering at Upgrid](/articles/engineering-at-upgrid-tech-stack/) is the stack tour: apps, metering, allocation, billing, and how a small team ships regulated energy software. [Shipping at Upgrid](/articles/shipping-at-upgrid/) is the cadence piece — merge frequency, time-to-production, and how that compares to a bank-scale estate. The [Upgrid work entry](/work/upgrid/) is the short version — role, scope, and what is live today.

The correctness bar comes from somewhere else on this site. [Fintech Infrastructure](/topics/fintech-infrastructure/) and [Fraud Prevention](/topics/fraud-prevention/) cover the years of regulated payments work that set it.
