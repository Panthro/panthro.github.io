---
title: "Stream Processing"
description: "Apache Flink, Kafka, and stateful stream processing for regulated fintech — talks and writing by Rafael Roman."
relatedArticles:
  - rebuilding-fraud-prevention-at-n26
  - engineering-at-n26-tech-stack
relatedTalks:
  - kotlinconf-2024
  - kafka-summit-london-2023
relatedWork:
  - n26
---

Stream processing became the backbone of how we replaced batch-oriented fraud checks with sub-second decisions at N26. That meant Flink job design, state backend choices, window semantics, and the unglamorous work of making operators trust the pipeline.

The KotlinConf session goes deep on the Flink migration. The Kafka Summit talk frames the broader event-driven architecture, including the outbox pattern we used to kill double writes. The fraud-prevention article ties both to outcomes and organizational lessons.

Written for engineers who need to move from "we have Kafka" to "we have a system that can decide in real time." For what that system was actually deciding, see [Fraud Prevention](/topics/fraud-prevention/).
