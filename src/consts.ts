import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "Rafael Roman",
  NUM_WORKS_ON_HOMEPAGE: 3,
  NUM_ARTICLES_ON_HOMEPAGE: 3,
  JOB_TITLE: "CTO & Co-founder",
  COMPANY: "Upgrid",
  COMPANY_URL: "https://upgrid.ch",
  OG_IMAGE: "/og-default.png",
};

export const HOME: Metadata = {
  TITLE: "Rafael Roman — CTO & Co-founder · Distributed Systems",
  DESCRIPTION:
    "Rafael Roman — CTO & Co-founder of Upgrid. 20+ years building fintech and distributed systems at N26, Personio, and GFT. Speaker at Kafka Summit, KotlinConf, and TEDx. Based in Basel.",
};

export const WORK: Metadata = {
  TITLE: "Work — N26, Personio, Upgrid · Rafael Roman",
  DESCRIPTION:
    "Career history of Rafael Roman — Principal Engineer at N26 and Personio, Co-founder & CTO at Upgrid. Fintech, distributed systems, and platform engineering across Europe.",
};

export const SPEAKING: Metadata = {
  TITLE: "Conference Talks — Kafka Summit, KotlinConf · Rafael Roman",
  DESCRIPTION:
    "Talks and keynotes by Rafael Roman — Kafka Summit London, KotlinConf, WeAreDevelopers World Congress, JavaCro, DevBCN, and TEDx on distributed systems, streaming, and AI.",
};

export const ARTICLES: Metadata = {
  TITLE: "Writing — Engineering Leadership & Systems · Rafael Roman",
  DESCRIPTION:
    "Articles by Rafael Roman on distributed systems, fintech engineering, fraud prevention, energy tech, and engineering leadership from N26, Personio, and Upgrid.",
};

export const TOPICS: Metadata = {
  TITLE: "Topics — Fraud, Streaming, Fintech · Rafael Roman",
  DESCRIPTION:
    "Curated topic hubs by Rafael Roman — fraud prevention, stream processing, engineering leadership, fintech infrastructure, and energy tech.",
};

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
