export type PublishMode = "approve" | "auto";
export type CmsType = "wordpress" | "webflow" | "custom";
export type ArticleStatus =
  | "draft"
  | "review"
  | "scheduled"
  | "published"
  | "paused";
export type KeywordStatus = "queued" | "writing" | "published" | "paused";

export interface Settings {
  id: number;
  site_url: string;
  cms_type: CmsType;
  publish_mode: PublishMode;
  frequency_days: number;
  autopilot_on: boolean;
  onboarded: boolean;
  gbp_connected: boolean;
  gsc_connected: boolean;
  language_pref: "en" | "both";
  webhook_url: string | null;
  brand_learned_at: string | null;
  next_run_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BrandProfile {
  id: number;
  voice_summary: string;
  services: string[];
  service_areas: string[];
  differentiators: string[];
  pricing_notes: string;
  testimonials: { author: string; quote: string }[];
  cta_language: string;
  scraped_excerpt: string | null;
  updated_at: string;
}

export interface KeywordRow {
  id: number;
  keyword: string;
  category: string;
  intent: string;
  suburb: string | null;
  language: string;
  volume_score: number;
  competition_score: number;
  conversion_score: number;
  opportunity_score: number;
  status: KeywordStatus;
  paa_questions: string[];
  created_at: string;
}

export interface ArticleRow {
  id: number;
  keyword_id: number | null;
  title: string;
  slug: string;
  language: string;
  status: ArticleStatus;
  meta_title: string | null;
  meta_description: string | null;
  h1: string | null;
  outline: { h2: string; bullets: string[] }[];
  body_markdown: string;
  faq: { q: string; a: string }[];
  schema_json: string | null;
  image_url: string | null;
  image_alt: string | null;
  image_prompt: string | null;
  internal_links: { text: string; href: string }[];
  word_count: number | null;
  scheduled_for: string | null;
  published_at: string | null;
  wp_post_id: number | null;
  impressions: number;
  clicks: number;
  avg_position: number | null;
  estimated_bookings: number | null;
  created_at: string;
  updated_at: string;
  keyword?: string;
}

export interface MetricDay {
  day: string;
  impressions: number;
  clicks: number;
  avg_position: number;
  ctr: number;
  estimated_bookings: number;
}

export interface CompetitorRow {
  id: number;
  name: string;
  url: string | null;
  notes: string | null;
  threat: "high" | "medium" | "low";
  overlapping_keywords: number;
  last_seen: string | null;
}

export interface GbpPost {
  id: number;
  title: string;
  body: string;
  cta: string | null;
  status: "suggested" | "copied" | "published";
  scheduled_for: string | null;
  created_at: string;
}

export interface ActivityRow {
  id: number;
  kind: string;
  message: string;
  created_at: string;
}

export interface DashboardPayload {
  settings: Settings;
  brand: BrandProfile | null;
  metrics: MetricDay[];
  totals: {
    impressions: number;
    clicks: number;
    avgPosition: number;
    ctr: number;
    bookings: number;
    visibility: number;
  };
  suburbScores: { suburb: string; score: number; posts: number }[];
  keywords: KeywordRow[];
  articles: ArticleRow[];
  activity: ActivityRow[];
  competitors: CompetitorRow[];
  gbp: GbpPost[];
  queue: {
    nextKeyword: KeywordRow | null;
    nextArticle: ArticleRow | null;
    publishedCount: number;
    reviewCount: number;
    queuedKeywords: number;
  };
}

export interface GeneratedPack {
  title: string;
  meta_title: string;
  meta_description: string;
  h1: string;
  slug: string;
  outline: { h2: string; bullets: string[] }[];
  body_markdown: string;
  faq: { q: string; a: string }[];
  image_prompt: string;
  image_alt: string;
  internal_links: { text: string; href: string }[];
}
