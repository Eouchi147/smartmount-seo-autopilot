import { SMART_MOUNT } from "./brand";
import type { ArticleRow } from "./types";

export function buildArticleSchema(article: {
  title: string;
  slug: string;
  meta_description: string | null;
  body_markdown: string;
  faq: { q: string; a: string }[];
  image_url?: string | null;
}): string {
  const url = `${SMART_MOUNT.site}/blog/${article.slug}`;
  const graph: unknown[] = [
    {
      "@type": "LocalBusiness",
      "@id": `${SMART_MOUNT.site}/#business`,
      name: SMART_MOUNT.name,
      url: SMART_MOUNT.site,
      image: SMART_MOUNT.site,
      telephone: "",
      priceRange: "$$",
      areaServed: SMART_MOUNT.areas.map((name) => ({
        "@type": "City",
        name,
      })),
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: SMART_MOUNT.rating,
        reviewCount: 19,
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Ottawa",
        addressRegion: "ON",
        addressCountry: "CA",
      },
    },
    {
      "@type": "Service",
      name: "TV wall mounting",
      provider: { "@id": `${SMART_MOUNT.site}/#business` },
      areaServed: "Ottawa-Gatineau",
      serviceType: "TV and monitor installation",
    },
    {
      "@type": "Article",
      headline: article.title,
      description: article.meta_description,
      mainEntityOfPage: url,
      author: { "@type": "Organization", name: SMART_MOUNT.name },
      publisher: { "@id": `${SMART_MOUNT.site}/#business` },
      image: article.image_url || undefined,
      inLanguage: "en-CA",
    },
  ];

  if (article.faq.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: article.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    });
  }

  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2);
}

export function wordCount(markdown: string): number {
  return markdown.trim().split(/\s+/).filter(Boolean).length;
}

export function asJson<T>(value: unknown, fallback: T): T {
  if (value == null) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
}

export function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value !== "") {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return fallback;
}

export function toBool(value: unknown): boolean {
  return value === true || value === "t" || value === "true" || value === 1;
}
