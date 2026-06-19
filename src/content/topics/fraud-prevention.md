---
title: "Fraud Prevention"
description: "Real-time fraud and financial crime prevention at neobank scale — architecture, streaming, and lessons from rebuilding N26's risk engine."
relatedArticles:
  - rebuilding-fraud-prevention-at-n26
  - engineering-at-n26-tech-stack
relatedTalks:
  - kotlinconf-2024
  - kafka-summit-london-2023
relatedWork:
  - n26
---

Financial crime prevention at a neobank is not a rules engine problem — it is a latency, data, and organizational problem. The static microservice sprawl we inherited at N26 could not keep pace with attack patterns that changed weekly.

Rebuilding the system meant committing to stream processing: event-time semantics, managed state, and operational discipline for jobs that cannot go down during a payment. The fraud article on this site walks through that rebuild in detail; the KotlinConf and Kafka Summit talks cover the streaming and event-driven angles from the same period.

If you are evaluating how to modernize risk at scale, start with the article, then the talks — they are different lenses on the same body of work.
