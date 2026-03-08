import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "Rafael Roman",
  EMAIL: "panthro.rafael@gmail.com",
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_WORKS_ON_HOMEPAGE: 3,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "CTO & Co-founder · 20+ years building software that matters · Based in Basel 🇨🇭",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "Thoughts on distributed systems, fintech, energy tech, and engineering leadership.",
};

export const WORK: Metadata = {
  TITLE: "Work",
  DESCRIPTION: "20+ years across the full stack of software and business.",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION: "Things I've built or contributed to.",
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
