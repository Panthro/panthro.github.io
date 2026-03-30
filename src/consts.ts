import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "Rafael Roman",
  NUM_WORKS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "CTO & Co-founder · 20+ years building software that matters · Based in Basel 🇨🇭",
};

export const WORK: Metadata = {
  TITLE: "Work",
  DESCRIPTION: "20+ years across the full stack of software and business.",
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
