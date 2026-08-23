import { PHOTO_SIZE, SAME_AS, SITE } from "@consts";

const SITE_ORIGIN = "https://rafaelroman.com";

export const DEFAULT_OG_IMAGE = "/og-default.png";

type JsonLd = Record<string, unknown>;

/** Stable @id so every schema on the site points at one Person node. */
export const PERSON_ID = `${SITE_ORIGIN}/#person`;
const WEBSITE_ID = `${SITE_ORIGIN}/#website`;
const BLOG_ID = `${SITE_ORIGIN}/articles/#blog`;

function absolute(pathOrUrl: string): string {
  return pathOrUrl.startsWith("http")
    ? pathOrUrl
    : `${SITE_ORIGIN}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

export function personSchema(description: string): JsonLd {
  // Absolute URL — schema.org consumers do not resolve root-relative paths.
  // TODO(rafa): the current headshot is a profile-angle shot with sunglasses and
  // the face fills a small part of the frame; it is weak input for Knowledge
  // Graph image matching. A front-facing headshot would materially improve it.
  const photo: JsonLd | null = SITE.PHOTO
    ? {
        "@type": "ImageObject",
        url: absolute(SITE.PHOTO),
        contentUrl: absolute(SITE.PHOTO),
        width: PHOTO_SIZE.WIDTH,
        height: PHOTO_SIZE.HEIGHT,
      }
    : null;

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: SITE.NAME,
    url: SITE_ORIGIN,
    jobTitle: SITE.JOB_TITLE,
    description,
    worksFor: {
      "@type": "Organization",
      name: SITE.COMPANY,
      url: SITE.COMPANY_URL,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Basel",
      addressCountry: "CH",
    },
    homeLocation: {
      "@type": "Place",
      name: "Basel, Switzerland",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Basel",
        addressCountry: "CH",
      },
    },
    birthPlace: {
      "@type": "Place",
      name: "São Paulo, Brazil",
      address: {
        "@type": "PostalAddress",
        addressLocality: "São Paulo",
        addressCountry: "BR",
      },
    },
    // TODO(rafa): confirm whether a second nationality (Spanish / Swiss) should
    // be listed here — only Brazilian is evidenced by the site's own content.
    nationality: {
      "@type": "Country",
      name: "Brazil",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "FATEC Sorocaba",
      // TODO(rafa): add `url` once the right official FATEC Sorocaba page is confirmed.
    },
    ...(photo ? { image: photo } : {}),
    sameAs: SAME_AS,
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

/**
 * Google's dedicated schema for creator/author identity pages.
 * Intended for the home page — wrap the Person as `mainEntity`.
 *
 * Usage in src/pages/index.astro:
 *   const jsonLd = [profilePageSchema(HOME.DESCRIPTION), webSiteSchema(HOME.DESCRIPTION)];
 * (replaces the current standalone `personSchema(...)` entry).
 */
export function profilePageSchema(description: string): JsonLd {
  const person = { ...(personSchema(description) as Record<string, unknown>) };
  delete person["@context"];

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE_ORIGIN}/#profilepage`,
    url: SITE_ORIGIN,
    name: SITE.NAME,
    description,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: person,
  };
}

export function webSiteSchema(description: string): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE.NAME,
    url: SITE_ORIGIN,
    description,
    inLanguage: "en",
    author: {
      "@type": "Person",
      "@id": PERSON_ID,
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
  dateModified?: Date;
  tags?: string[];
  wordCount?: number;
  articleSection?: string;
}): JsonLd {
  const {
    title,
    description,
    url,
    datePublished,
    dateModified,
    tags = [],
    wordCount,
    articleSection,
  } = options;

  const section = articleSection ?? tags[0];

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url,
    inLanguage: "en",
    datePublished: datePublished.toISOString(),
    dateModified: (dateModified ?? datePublished).toISOString(),
    author: {
      "@type": "Person",
      "@id": PERSON_ID,
      name: SITE.NAME,
      url: SITE_ORIGIN,
      jobTitle: SITE.JOB_TITLE,
    },
    publisher: {
      "@type": "Person",
      "@id": PERSON_ID,
      name: SITE.NAME,
      url: SITE_ORIGIN,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    isPartOf: {
      "@type": "Blog",
      "@id": BLOG_ID,
      name: "Writing",
      url: `${SITE_ORIGIN}/articles/`,
    },
    image: `${SITE_ORIGIN}${DEFAULT_OG_IMAGE}`,
    ...(section ? { articleSection: section } : {}),
    ...(wordCount && wordCount > 0 ? { wordCount } : {}),
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

/** Hosts whose links are genuinely a video, not a session/landing page. */
const VIDEO_HOSTS = [
  "ted.com",
  "youtube.com",
  "youtu.be",
  "vimeo.com",
];

export function isVideoUrl(url: string | undefined): boolean {
  if (!url) return false;
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return VIDEO_HOSTS.some(
      (candidate) => host === candidate || host.endsWith(`.${candidate}`)
    );
  } catch {
    return false;
  }
}

/**
 * YYYY-MM-DD — talks have no recorded start time, so date-only is honest.
 *
 * Uses local date parts, not `toISOString()`: speaking frontmatter dates are
 * `MM/DD/YYYY`, which `z.coerce.date()` parses as local midnight. Converting
 * those to UTC shifts them to the previous day in any positive-offset zone
 * (CET/CEST included), so KotlinConf's 05/23 rendered as 2024-05-22.
 */
export function isoDate(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function eventSchema(options: {
  name: string;
  description: string;
  url: string;
  startDate: Date;
  /** Same day as startDate unless the talk genuinely spanned more. */
  endDate?: Date;
  location: string;
  externalUrl?: string;
  recordingUrl?: string;
}): JsonLd {
  const {
    name,
    description,
    url,
    startDate,
    endDate,
    location,
    externalUrl,
    recordingUrl,
  } = options;

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name,
    description,
    url,
    startDate: isoDate(startDate),
    endDate: isoDate(endDate ?? startDate),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: location,
    },
    performer: {
      "@type": "Person",
      "@id": PERSON_ID,
      name: SITE.NAME,
      url: SITE_ORIGIN,
    },
    ...(externalUrl ? { sameAs: externalUrl } : {}),
    // TODO(rafa): VideoObject has no `thumbnailUrl` — Google needs one for video
    // rich results. Add a locally hosted still (or the verified TED poster frame)
    // and thread it through here.
    ...(recordingUrl
      ? {
          recordedIn: {
            "@type": "VideoObject",
            name,
            description,
            uploadDate: isoDate(startDate),
            url: recordingUrl,
            embedUrl: recordingUrl,
          },
        }
      : {}),
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
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
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
