export type Site = {
  NAME: string;
  NUM_WORKS_ON_HOMEPAGE: number;
  NUM_ARTICLES_ON_HOMEPAGE: number;
  JOB_TITLE: string;
  COMPANY: string;
  COMPANY_URL: string;
  OG_IMAGE: string;
};

export type Metadata = {
  TITLE: string;
  DESCRIPTION: string;
};

export type Socials = {
  NAME: string;
  HREF: string;
}[];
