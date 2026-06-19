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

export function eventSchema(options: {
  name: string;
  description: string;
  url: string;
  startDate: Date;
  location: string;
  externalUrl?: string;
}): JsonLd {
  const { name, description, url, startDate, location, externalUrl } = options;

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name,
    description,
    url,
    startDate: startDate.toISOString(),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: location,
    },
    performer: {
      "@type": "Person",
      name: SITE.NAME,
      url: SITE_ORIGIN,
    },
    ...(externalUrl ? { sameAs: externalUrl } : {}),
    image: `${SITE_ORIGIN}${DEFAULT_OG_IMAGE}`,
  };
}

export function collectionPageSchema(options: {
  name: string;
  description: string;
  url: string;
  items: { name: string; url: string }[];
}): JsonLd {
  const { name, description, url, items } = options;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: item.url,
      })),
    },
  };
}
