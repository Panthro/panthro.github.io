---
title: "Fraud Prevention"
description: "Rebuilding N26's fraud engine: a static rule engine spread across dozens of microservices replaced by a stateful Apache Flink pipeline in six months, payment to decision in ~52ms."
relatedArticles:
  - ai-reverse-engineering-cant-hack-your-bank
  - rebuilding-fraud-prevention-at-n26
  - engineering-at-n26-tech-stack
relatedTalks:
  - kotlinconf-2024
  - kafka-summit-london-2023
relatedWork:
  - n26
---

In six months at N26 we replaced a static rule engine spread across dozens of microservices with a single stateful Apache Flink pipeline. Shipping a new fraud rule went from four weeks, or three to six months for anything that needed state, to about two weeks. A payment reaches a risk decision in roughly 52 milliseconds.

Financial crime prevention at a neobank is not a rules engine problem — it is a latency, data, and organizational problem. The microservice sprawl we inherited could not keep pace with attack patterns that changed weekly, and the bottleneck was never the rule logic. It was the deployment pipeline underneath it.

Rebuilding meant committing to stream processing: event-time semantics, managed state, and the operational discipline required for jobs that cannot go down mid-payment. It also meant getting the monitoring in before the business logic, which we did in the wrong order.

## Where to start

[Rebuilding Fraud Prevention from Scratch in Six Months](/articles/rebuilding-fraud-prevention-at-n26/) walks through the rebuild: the latency budget, the score thresholds, the rollout, and what it cost. [Engineering at N26](/articles/engineering-at-n26-tech-stack/) is the wide-angle companion piece, covering the platform the rebuild ran on.

Two talks cover the same body of work from different angles: [KotlinConf 2024](/speaking/kotlinconf-2024/) on the Flink migration itself, and [Kafka Summit London 2023](/speaking/kafka-summit-london-2023/) on the event-driven architecture beneath it. For the mechanics rather than the outcome, see [Stream Processing](/topics/stream-processing/).
