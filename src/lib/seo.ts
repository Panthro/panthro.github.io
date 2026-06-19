import { SITE, SOCIALS } from "@consts";

const SITE_ORIGIN = "https://rafaelroman.com";

export const DEFAULT_OG_IMAGE = "/og-default.png";

type JsonLd = Record<string, unknown>;

export function personSchema(description: string): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.NAME,
    url: SITE_ORIGIN,
    jobTitle: SITE.JOB_TITLE,
    description,
    worksFor: {
      "@type": "Organization",
      name: SITE.COMPANY,
      url: SITE.COMPANY_URL,
    },
    sameAs: SOCIALS.map((social) => social.HREF),
    knowsAbout: [
      "Distributed systems",
      "Fintech",
      "Energy technology",
      "Engineering leadership",
      "Apache Kafka",
      "Apache Flink",
    ],
  };
}

export function webSiteSchema(description: string): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.NAME,
    url: SITE_ORIGIN,
    description,
    author: {
      "@type": "Person",
      name: SITE.NAME,
      url: SITE_ORIGIN,
    },
  };
}

export function articleSchema(options: {
  title: string;
  description: string;
  url: string;
  datePublished: Date;
  tags?: string[];
}): JsonLd {
  const { title, description, url, datePublished, tags = [] } = options;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url,
    datePublished: datePublished.toISOString(),
    author: {
      "@type": "Person",
      name: SITE.NAME,
      url: SITE_ORIGIN,
      jobTitle: SITE.JOB_TITLE,
    },
    publisher: {
      "@type": "Person",
      name: SITE.NAME,
      url: SITE_ORIGIN,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    image: `${SITE_ORIGIN}${DEFAULT_OG_IMAGE}`,
    ...(tags.length > 0 ? { keywords: tags.join(", ") } : {}),
  };
}

export function breadcrumbSchema(
  items: { name: string; url: string }[]
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
