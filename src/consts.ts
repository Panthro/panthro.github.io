import type { Site, Metadata, Socials } from "@types";

// PHOTO feeds Person.image in JSON-LD — one of the strongest entity signals
// Google uses to disambiguate "Rafael Roman". 800x800 square; a 400x400 variant
// and WebP siblings ship alongside it. Set to null to omit the property.
export const SITE: Site & { PHOTO?: string | null } = {
  NAME: "Rafael Roman",
  NUM_WORKS_ON_HOMEPAGE: 3,
  NUM_ARTICLES_ON_HOMEPAGE: 3,
  JOB_TITLE: "CTO & Co-founder",
  COMPANY: "Upgrid",
  COMPANY_URL: "https://upgrid.ch",
  OG_IMAGE: "/og-default.png",
  PHOTO: "/rafael-roman.jpg",
};

/** Intrinsic dimensions of SITE.PHOTO — keep in sync with the asset. */
export const PHOTO_SIZE = { WIDTH: 800, HEIGHT: 800 } as const;

export const HOME: Metadata = {
  TITLE: "Rafael Roman · CTO & Co-founder · Distributed Systems",
  DESCRIPTION:
    "Rafael Roman — CTO & Co-founder of Upgrid. 20+ years building fintech and distributed systems at N26, Personio, and GFT. Speaker at Kafka Summit, KotlinConf, and TEDx. Based in Basel.",
};

export const ABOUT: Metadata = {
  TITLE: "About Rafael Roman — Engineer, Speaker, CTO of Upgrid",
  DESCRIPTION:
    "Rafael Roman is a software engineer and the co-founder and CTO of Upgrid, in Basel. Twenty years building regulated systems across Brazil, Spain and Switzerland — GFT, IBM, N26, Personio. Speaker at Kafka Summit, KotlinConf and TEDx.",
};

export const WORK: Metadata = {
  TITLE: "Work · N26, Personio, Upgrid · Rafael Roman",
  DESCRIPTION:
    "Career history of Rafael Roman — Principal Engineer at N26 and Personio, Co-founder & CTO at Upgrid. Fintech, distributed systems, and platform engineering across Europe.",
};

export const SPEAKING: Metadata = {
  TITLE: "Conference Talks · Kafka Summit, KotlinConf · Rafael Roman",
  DESCRIPTION:
    "Talks and keynotes by Rafael Roman — Kafka Summit London, KotlinConf, WeAreDevelopers World Congress, JavaCro, DevBCN, and TEDx on distributed systems, streaming, and AI.",
};

export const ARTICLES: Metadata = {
  TITLE: "Writing · Engineering Leadership & Systems · Rafael Roman",
  DESCRIPTION:
    "Articles by Rafael Roman on distributed systems, fintech engineering, fraud prevention, energy tech, and engineering leadership from N26, Personio, and Upgrid.",
};

export const TOPICS: Metadata = {
  TITLE: "Topics · Fraud, Streaming, Fintech · Rafael Roman",
  DESCRIPTION:
    "Curated topic hubs by Rafael Roman — fraud prevention, stream processing, engineering leadership, fintech infrastructure, and energy tech.",
};

export const JOURNEY: Metadata = {
  TITLE: "Journey · São Paulo to Basel · Rafael Roman",
  DESCRIPTION:
    "The path from São Paulo to Basel — career, launches, and talks across Brazil, Spain, and Switzerland. A scroll-driven story of building systems where correctness is financial.",
};

/**
 * Visible social row (home page + footer). Deliberately short — this is a UI
 * list, not an SEO list. Add profiles to SAME_AS instead.
 */
export const SOCIALS: Socials = [
  {
    NAME: "linkedin",
    HREF: "https://linkedin.com/in/panthro",
  },
  {
    NAME: "github",
    HREF: "https://github.com/panthro",
  },
  {
    NAME: "stackoverflow",
    HREF: "https://stackoverflow.com/users/656094",
  },
  {
    NAME: "sessionize",
    HREF: "https://sessionize.com/rafaelroman",
  },
];

/**
 * Person.sameAs — entity disambiguation only, never rendered.
 * "Rafael Roman" is shared with several other public people; sameAs is the
 * strongest signal available for tying this site to the right entity.
 *
 * Every URL below was verified with `curl -L` before being added.
 * Two are served behind bot protection and could not be fetched headlessly:
 *   - medium.com/@panthro     403 to curl; confirmed live via medium.com/feed/@panthro (200)
 *   - 2024.kotlinconf.com/... 429 to curl (site-wide rate limit); already shipped
 *                             in src/content/speaking/kotlinconf-2024.md
 */
export const SAME_AS: string[] = [
  ...SOCIALS.map((social) => social.HREF),
  "https://medium.com/@panthro",
  "https://www.ted.com/talks/rafael_roman_la_ia_no_es_el_mundo_de_las_peliculas_es_ya_la_realidad",
  "https://www.tedxlleida.com/rafael-roman/",
  "https://2024.kotlinconf.com/talks/551172/",
  "https://www.confluent.io/events/kafka-summit-london-2023/eliminating-the-double-write-problem-in-apache-kafka-using-the-outbox/",
  "https://www.devbcn.com/2024/talks/610578",
];
