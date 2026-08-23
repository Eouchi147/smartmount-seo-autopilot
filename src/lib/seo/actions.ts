import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { SMART_MOUNT, opportunityScore } from "./brand";
import {
  VOICE_SYSTEM,
  articleUserPrompt,
  discoverUserPrompt,
  gbpUserPrompt,
} from "./prompts";
import { chatGrok, extractJson, generateImage } from "./xai";
import {
  asJson,
  buildArticleSchema,
  toBool,
  toNumber,
  wordCount,
} from "./schema";
import { slugify } from "@/lib/utils";
import type {
  ActivityRow,
  ArticleRow,
  BrandProfile,
  CompetitorRow,
  DashboardPayload,
  GbpPost,
  GeneratedPack,
  KeywordRow,
  MetricDay,
  Settings,
} from "./types";

function mapSettings(row: Record<string, unknown>): Settings {
  return {
    id: toNumber(row.id, 1),
    site_url: String(row.site_url ?? SMART_MOUNT.site),
    cms_type: (row.cms_type as Settings["cms_type"]) ?? "wordpress",
    publish_mode: (row.publish_mode as Settings["publish_mode"]) ?? "approve",
    frequency_days: toNumber(row.frequency_days, 1),
    autopilot_on: toBool(row.autopilot_on),
    onboarded: toBool(row.onboarded),
    gbp_connected: toBool(row.gbp_connected),
    gsc_connected: toBool(row.gsc_connected),
    language_pref: row.language_pref === "both" ? "both" : "en",
    webhook_url: row.webhook_url ? String(row.webhook_url) : null,
    brand_learned_at: row.brand_learned_at ? String(row.brand_learned_at) : null,
    next_run_at: row.next_run_at ? String(row.next_run_at) : null,
    created_at: String(row.created_at ?? ""),
    updated_at: String(row.updated_at ?? ""),
  };
}

function mapKeyword(row: Record<string, unknown>): KeywordRow {
  return {
    id: toNumber(row.id),
    keyword: String(row.keyword),
    category: String(row.category),
    intent: String(row.intent),
    suburb: row.suburb ? String(row.suburb) : null,
    language: String(row.language ?? "en"),
    volume_score: toNumber(row.volume_score),
    competition_score: toNumber(row.competition_score),
    conversion_score: toNumber(row.conversion_score),
    opportunity_score: toNumber(row.opportunity_score),
    status: (row.status as KeywordRow["status"]) ?? "queued",
    paa_questions: asJson<string[]>(row.paa_questions, []),
    created_at: String(row.created_at ?? ""),
  };
}

function mapArticle(row: Record<string, unknown>): ArticleRow {
  return {
    id: toNumber(row.id),
    keyword_id: row.keyword_id == null ? null : toNumber(row.keyword_id),
    title: String(row.title),
    slug: String(row.slug),
    language: String(row.language ?? "en"),
    status: (row.status as ArticleRow["status"]) ?? "draft",
    meta_title: row.meta_title ? String(row.meta_title) : null,
    meta_description: row.meta_description ? String(row.meta_description) : null,
    h1: row.h1 ? String(row.h1) : null,
    outline: asJson(row.outline, []),
    body_markdown: String(row.body_markdown ?? ""),
    faq: asJson(row.faq, []),
    schema_json: row.schema_json ? String(row.schema_json) : null,
    image_url: row.image_url ? String(row.image_url) : null,
    image_alt: row.image_alt ? String(row.image_alt) : null,
    image_prompt: row.image_prompt ? String(row.image_prompt) : null,
    internal_links: asJson(row.internal_links, []),
    word_count: row.word_count == null ? null : toNumber(row.word_count),
    scheduled_for: row.scheduled_for ? String(row.scheduled_for).slice(0, 10) : null,
    published_at: row.published_at ? String(row.published_at) : null,
    wp_post_id: row.wp_post_id == null ? null : toNumber(row.wp_post_id),
    impressions: toNumber(row.impressions),
    clicks: toNumber(row.clicks),
    avg_position: row.avg_position == null ? null : toNumber(row.avg_position),
    estimated_bookings:
      row.estimated_bookings == null ? null : toNumber(row.estimated_bookings),
    created_at: String(row.created_at ?? ""),
    updated_at: String(row.updated_at ?? ""),
    keyword: row.keyword ? String(row.keyword) : undefined,
  };
}

function mapBrand(row: Record<string, unknown>): BrandProfile {
  return {
    id: 1,
    voice_summary: String(row.voice_summary ?? ""),
    services: asJson(row.services, []),
    service_areas: asJson(row.service_areas, []),
    differentiators: asJson(row.differentiators, []),
    pricing_notes: String(row.pricing_notes ?? ""),
    testimonials: asJson(row.testimonials, []),
    cta_language: String(row.cta_language ?? ""),
    scraped_excerpt: row.scraped_excerpt ? String(row.scraped_excerpt) : null,
    updated_at: String(row.updated_at ?? ""),
  };
}

async function log(kind: string, message: string) {
  const sql = await getSql();
  await sql`insert into activity_log (kind, message) values (${kind}, ${message})`;
}

export const getSettings = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql`select * from settings where id = 1`;
  return rows[0] ? mapSettings(rows[0]) : null;
});

export const getDashboard = createServerFn({ method: "GET" }).handler(
  async (): Promise<DashboardPayload> => {
    const sql = await getSql();
    const [settingsRows, brandRows, metricRows, keywordRows, articleRows, activityRows, competitorRows, gbpRows] =
      await Promise.all([
        sql`select * from settings where id = 1`,
        sql`select * from brand_profile where id = 1`,
        sql`select * from metrics_daily order by day asc`,
        sql`select * from keywords order by opportunity_score desc`,
        sql`select a.*, k.keyword from articles a left join keywords k on k.id = a.keyword_id order by a.created_at desc`,
        sql`select * from activity_log order by created_at desc limit 12`,
        sql`select * from competitors order by overlapping_keywords desc`,
        sql`select * from gbp_posts order by scheduled_for asc`,
      ]);

    const settings = settingsRows[0]
      ? mapSettings(settingsRows[0])
      : mapSettings({ id: 1, site_url: SMART_MOUNT.site });
    const brand = brandRows[0] ? mapBrand(brandRows[0]) : null;
    const metrics: MetricDay[] = metricRows.map((row) => ({
      day: String(row.day).slice(0, 10),
      impressions: toNumber(row.impressions),
      clicks: toNumber(row.clicks),
      avg_position: toNumber(row.avg_position),
      ctr: toNumber(row.ctr),
      estimated_bookings: toNumber(row.estimated_bookings),
    }));
    const keywords = keywordRows.map(mapKeyword);
    const articles = articleRows.map(mapArticle);

    const last14 = metrics.slice(-14);
    const impressions = last14.reduce((s, d) => s + d.impressions, 0);
    const clicks = last14.reduce((s, d) => s + d.clicks, 0);
    const bookings = last14.reduce((s, d) => s + d.estimated_bookings, 0);
    const avgPosition =
      last14.length > 0
        ? last14.reduce((s, d) => s + d.avg_position, 0) / last14.length
        : 0;
    const ctr = impressions > 0 ? clicks / impressions : 0;

    const published = articles.filter((a) => a.status === "published");
    const suburbMap = new Map<string, { score: number; posts: number }>();
    for (const kw of keywords) {
      const suburb = kw.suburb ?? "Ottawa";
      const prev = suburbMap.get(suburb) ?? { score: 0, posts: 0 };
      const posts = published.filter((a) => a.keyword_id === kw.id).length;
      const boost = kw.status === "published" ? 18 : kw.status === "writing" ? 8 : 0;
      suburbMap.set(suburb, {
        score: Math.min(100, prev.score + Math.round(kw.opportunity_score * 0.12) + boost + posts * 14),
        posts: prev.posts + posts,
      });
    }
    const suburbScores = [...suburbMap.entries()]
      .map(([suburb, v]) => ({ suburb, ...v }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    const visibility = Math.min(
      96,
      38 + published.length * 9 + Math.round((100 - avgPosition) * 0.35),
    );

    const nextKeyword =
      keywords.find((k) => k.status === "queued") ?? null;
    const nextArticle =
      articles.find((a) => a.status === "review" || a.status === "scheduled") ?? null;

    return {
      settings,
      brand,
      metrics,
      totals: {
        impressions,
        clicks,
        avgPosition: Math.round(avgPosition * 10) / 10,
        ctr,
        bookings: Math.round(bookings * 10) / 10,
        visibility,
      },
      suburbScores,
      keywords,
      articles,
      activity: activityRows.map((row) => ({
        id: toNumber(row.id),
        kind: String(row.kind),
        message: String(row.message),
        created_at: String(row.created_at ?? ""),
      })) as ActivityRow[],
      competitors: competitorRows.map((row) => ({
        id: toNumber(row.id),
        name: String(row.name),
        url: row.url ? String(row.url) : null,
        notes: row.notes ? String(row.notes) : null,
        threat: (row.threat as CompetitorRow["threat"]) ?? "medium",
        overlapping_keywords: toNumber(row.overlapping_keywords),
        last_seen: row.last_seen ? String(row.last_seen) : null,
      })),
      gbp: gbpRows.map((row) => ({
        id: toNumber(row.id),
        title: String(row.title),
        body: String(row.body),
        cta: row.cta ? String(row.cta) : null,
        status: (row.status as GbpPost["status"]) ?? "suggested",
        scheduled_for: row.scheduled_for ? String(row.scheduled_for).slice(0, 10) : null,
        created_at: String(row.created_at ?? ""),
      })),
      queue: {
        nextKeyword,
        nextArticle,
        publishedCount: published.length,
        reviewCount: articles.filter((a) => a.status === "review").length,
        queuedKeywords: keywords.filter((k) => k.status === "queued").length,
      },
    };
  },
);

export const completeOnboarding = createServerFn({ method: "POST" })
  .validator(
    (input: {
      site_url: string;
      cms_type: Settings["cms_type"];
      publish_mode: Settings["publish_mode"];
      frequency_days: number;
      language_pref: "en" | "both";
      gbp_connected: boolean;
      gsc_connected: boolean;
    }) => input,
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`
      update settings set
        site_url = ${data.site_url},
        cms_type = ${data.cms_type},
        publish_mode = ${data.publish_mode},
        frequency_days = ${data.frequency_days},
        language_pref = ${data.language_pref},
        gbp_connected = ${data.gbp_connected},
        gsc_connected = ${data.gsc_connected},
        onboarded = true,
        autopilot_on = true,
        next_run_at = now() + (${data.frequency_days} || ' days')::interval,
        updated_at = now()
      where id = 1
    `;
    await log("onboard", `Connected ${data.site_url}. Autopilot armed.`);
    return { ok: true as const };
  });

export const learnBrand = createServerFn({ method: "POST" })
  .validator((input: { site_url: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const pages = [data.site_url, `${data.site_url.replace(/\/$/, "")}/commercial.html`];
    const chunks: string[] = [];
    for (const url of pages) {
      try {
        const res = await fetch(url, {
          headers: { "User-Agent": "SmartMountSEOAutopilot/1.0" },
          signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) continue;
        const html = await res.text();
        const text = html
          .replace(/<script[\s\S]*?<\/script>/gi, " ")
          .replace(/<style[\s\S]*?<\/style>/gi, " ")
          .replace(/<[^>]+>/g, " ")
          .replace(/&nbsp;/g, " ")
          .replace(/&/g, "&")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 4000);
        if (text) chunks.push(`SOURCE ${url}: ${text}`);
      } catch {
        // live site may be unreachable from the sandbox
      }
    }
    const excerpt = chunks.join("\n\n").slice(0, 6000) || null;
    await sql`
      update brand_profile set
        scraped_excerpt = ${excerpt},
        updated_at = now()
      where id = 1
    `;
    await sql`update settings set brand_learned_at = now(), updated_at = now() where id = 1`;
    await log("brand", `Learned brand voice from ${data.site_url}`);
    const brand = (await sql`select * from brand_profile where id = 1`)[0];
    return {
      ok: true as const,
      scraped: Boolean(excerpt),
      brand: brand ? mapBrand(brand) : null,
    };
  });

export const updateSettings = createServerFn({ method: "POST" })
  .validator(
    (input: {
      publish_mode?: Settings["publish_mode"];
      frequency_days?: number;
      autopilot_on?: boolean;
      language_pref?: "en" | "both";
      webhook_url?: string | null;
      gbp_connected?: boolean;
      gsc_connected?: boolean;
      cms_type?: Settings["cms_type"];
      site_url?: string;
    }) => input,
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const current = (await sql`select * from settings where id = 1`)[0];
    if (!current) return { ok: false as const, error: "Missing settings" };
    const next = mapSettings(current);
    const publish_mode = data.publish_mode ?? next.publish_mode;
    const frequency_days = data.frequency_days ?? next.frequency_days;
    const autopilot_on = data.autopilot_on ?? next.autopilot_on;
    const language_pref = data.language_pref ?? next.language_pref;
    const webhook_url =
      data.webhook_url === undefined ? next.webhook_url : data.webhook_url;
    const gbp_connected = data.gbp_connected ?? next.gbp_connected;
    const gsc_connected = data.gsc_connected ?? next.gsc_connected;
    const cms_type = data.cms_type ?? next.cms_type;
    const site_url = data.site_url ?? next.site_url;
    await sql`
      update settings set
        publish_mode = ${publish_mode},
        frequency_days = ${frequency_days},
        autopilot_on = ${autopilot_on},
        language_pref = ${language_pref},
        webhook_url = ${webhook_url},
        gbp_connected = ${gbp_connected},
        gsc_connected = ${gsc_connected},
        cms_type = ${cms_type},
        site_url = ${site_url},
        updated_at = now()
      where id = 1
    `;
    return { ok: true as const };
  });

export const setKeywordStatus = createServerFn({ method: "POST" })
  .validator((input: { id: number; status: KeywordRow["status"] }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`update keywords set status = ${data.status} where id = ${data.id}`;
    return { ok: true as const };
  });

export const discoverKeywords = createServerFn({ method: "POST" }).handler(
  async () => {
    const sql = await getSql();
    const existing = await sql<{ keyword: string }>`select keyword from keywords`;
    const result = await chatGrok({
      system: VOICE_SYSTEM,
      user: discoverUserPrompt(existing.map((r) => r.keyword)),
      maxTokens: 1800,
      temperature: 0.4,
    });
    if (!result.ok) return result;

    const parsed = extractJson<
      {
        keyword: string;
        category: string;
        intent: string;
        suburb: string | null;
        language: string;
        volume_score: number;
        competition_score: number;
        conversion_score: number;
        paa_questions?: string[];
      }[]
    >(result.text);
    if (!parsed?.length) {
      return { ok: false as const, error: "Could not parse keyword suggestions" };
    }

    let inserted = 0;
    for (const item of parsed.slice(0, 12)) {
      const keyword = item.keyword?.trim();
      if (!keyword) continue;
      const vol = Math.max(0, Math.min(100, Number(item.volume_score) || 40));
      const comp = Math.max(0, Math.min(100, Number(item.competition_score) || 40));
      const conv = Math.max(0, Math.min(100, Number(item.conversion_score) || 50));
      const opp = opportunityScore(vol, comp, conv);
      const paa = JSON.stringify(item.paa_questions ?? []);
      const rows = await sql`
        insert into keywords (
          keyword, category, intent, suburb, language,
          volume_score, competition_score, conversion_score, opportunity_score, paa_questions
        ) values (
          ${keyword},
          ${item.category || "intent"},
          ${item.intent || "transactional"},
          ${item.suburb || null},
          ${item.language === "fr" ? "fr" : "en"},
          ${vol}, ${comp}, ${conv}, ${opp},
          ${paa}::jsonb
        )
        on conflict (keyword) do nothing
        returning id
      `;
      if (rows.length) inserted += 1;
    }
    await log("keyword", `Discovered ${inserted} new Ottawa-Gatineau keywords`);
    return { ok: true as const, inserted };
  },
);

export const generateArticle = createServerFn({ method: "POST" })
  .validator((input: { keywordId: number; language?: "en" | "fr" }) => input)
  .handler(async ({ data }) => generateArticleForKeyword(data.keywordId, data.language));

async function generateArticleForKeyword(
  keywordId: number,
  languagePref?: "en" | "fr",
) {
  const sql = await getSql();
  const kwRows = await sql`select * from keywords where id = ${keywordId}`;
  const kw = kwRows[0] ? mapKeyword(kwRows[0]) : null;
  if (!kw) return { ok: false as const, error: "Keyword not found" };

  const language: "en" | "fr" =
    languagePref ?? (kw.language === "fr" ? "fr" : "en");

  await sql`update keywords set status = 'writing' where id = ${kw.id}`;

  const result = await chatGrok({
    system: VOICE_SYSTEM,
    user: articleUserPrompt(kw, language),
    maxTokens: 5000,
    temperature: 0.45,
  });
  if (!result.ok) {
    await sql`update keywords set status = 'queued' where id = ${kw.id}`;
    return result;
  }

  const pack = extractJson<GeneratedPack>(result.text);
  if (!pack?.body_markdown || !pack.title) {
    await sql`update keywords set status = 'queued' where id = ${kw.id}`;
    return { ok: false as const, error: "Article generation returned incomplete JSON" };
  }

  const slugBase = slugify(pack.slug || pack.title);
  let slug = slugBase;
  for (let i = 2; i < 8; i += 1) {
    const clash = await sql`select id from articles where slug = ${slug}`;
    if (!clash.length) break;
    slug = `${slugBase}-${i}`;
  }

  const faq = pack.faq ?? [];
  const outline = pack.outline ?? [];
  const links = pack.internal_links?.length
    ? pack.internal_links
    : [{ text: "Book now, mounted today", href: SMART_MOUNT.site }];
  const schema = buildArticleSchema({
    title: pack.title,
    slug,
    meta_description: pack.meta_description ?? null,
    body_markdown: pack.body_markdown,
    faq,
  });
  const words = wordCount(pack.body_markdown);
  const settings = (await sql`select publish_mode from settings where id = 1`)[0];
  const auto = settings?.publish_mode === "auto";
  const status = auto ? "scheduled" : "review";
  const scheduled = auto ? new Date().toISOString().slice(0, 10) : null;

  const inserted = await sql`
    insert into articles (
      keyword_id, title, slug, language, status, meta_title, meta_description, h1,
      outline, body_markdown, faq, schema_json, image_prompt, image_alt, internal_links,
      word_count, scheduled_for
    ) values (
      ${kw.id},
      ${pack.title},
      ${slug},
      ${language},
      ${status},
      ${pack.meta_title ?? pack.title},
      ${pack.meta_description ?? ""},
      ${pack.h1 ?? pack.title},
      ${JSON.stringify(outline)}::jsonb,
      ${pack.body_markdown},
      ${JSON.stringify(faq)}::jsonb,
      ${schema},
      ${pack.image_prompt ?? null},
      ${pack.image_alt ?? null},
      ${JSON.stringify(links)}::jsonb,
      ${words},
      ${scheduled}
    )
    returning id
  `;
  const id = toNumber(inserted[0]?.id);
  await log("generate", `Wrote “${pack.title}” for “${kw.keyword}”`);
  return { ok: true as const, id, status };
}

export const getArticle = createServerFn({ method: "GET" })
  .validator((input: { id: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql`
      select a.*, k.keyword from articles a
      left join keywords k on k.id = a.keyword_id
      where a.id = ${data.id}
    `;
    return rows[0] ? mapArticle(rows[0]) : null;
  });

export const updateArticle = createServerFn({ method: "POST" })
  .validator(
    (input: {
      id: number;
      title?: string;
      meta_title?: string;
      meta_description?: string;
      body_markdown?: string;
      status?: ArticleRow["status"];
    }) => input,
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql`select * from articles where id = ${data.id}`;
    if (!rows[0]) return { ok: false as const, error: "Not found" };
    const current = mapArticle(rows[0]);
    const title = data.title ?? current.title;
    const meta_title = data.meta_title ?? current.meta_title;
    const meta_description = data.meta_description ?? current.meta_description;
    const body_markdown = data.body_markdown ?? current.body_markdown;
    const status = data.status ?? current.status;
    const words = wordCount(body_markdown);
    const schema = buildArticleSchema({
      title,
      slug: current.slug,
      meta_description,
      body_markdown,
      faq: current.faq,
      image_url: current.image_url,
    });
    let publishedAt = current.published_at;
    if (status === "published" && !publishedAt) {
      publishedAt = new Date().toISOString();
    }
    await sql`
      update articles set
        title = ${title},
        meta_title = ${meta_title},
        meta_description = ${meta_description},
        body_markdown = ${body_markdown},
        status = ${status},
        word_count = ${words},
        schema_json = ${schema},
        published_at = ${publishedAt},
        updated_at = now()
      where id = ${data.id}
    `;
    if (status === "published" && current.keyword_id) {
      await sql`update keywords set status = 'published' where id = ${current.keyword_id}`;
    }
    if (status === "paused" && current.keyword_id) {
      await sql`update keywords set status = 'paused' where id = ${current.keyword_id}`;
    }
    return { ok: true as const };
  });

export const generateArticleImage = createServerFn({ method: "POST" })
  .validator((input: { id: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql`select * from articles where id = ${data.id}`;
    const article = rows[0] ? mapArticle(rows[0]) : null;
    if (!article) return { ok: false as const, error: "Not found" };
    const prompt =
      article.image_prompt ||
      `Photorealistic editorial photo of a clean TV wall-mount install in an Ottawa living room, 65-inch flush-mounted television, hidden cables, pale oak wall, winter afternoon light, no people, no logos, no stock-photo look. Topic: ${article.title}`;
    const img = await generateImage(prompt);
    if (!img.ok) return img;
    await sql`update articles set image_url = ${img.url}, updated_at = now() where id = ${data.id}`;
    await log("image", `Generated install photo for “${article.title}”`);
    return { ok: true as const, url: img.url };
  });

export const publishArticle = createServerFn({ method: "POST" })
  .validator(
    (input: {
      id: number;
      wpUser?: string;
      wpAppPassword?: string;
      webhookUrl?: string;
    }) => input,
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql`select a.*, k.keyword from articles a left join keywords k on k.id = a.keyword_id where a.id = ${data.id}`;
    const article = rows[0] ? mapArticle(rows[0]) : null;
    if (!article) return { ok: false as const, error: "Not found" };
    const settingsRows = await sql`select * from settings where id = 1`;
    const settings = settingsRows[0] ? mapSettings(settingsRows[0]) : null;
    const site = (settings?.site_url || SMART_MOUNT.site).replace(/\/$/, "");

    let wpPostId: number | null = article.wp_post_id;
    let channel: "wordpress" | "webhook" | "markdown" = "markdown";
    let detail = "Exported as Markdown. Connect WordPress application password to push live.";

    if (data.wpUser && data.wpAppPassword) {
      try {
        const auth = btoa(`${data.wpUser}:${data.wpAppPassword}`);
        const html = markdownToHtml(article.body_markdown);
        const res = await fetch(`${site}/wp-json/wp/v2/posts`, {
          method: "POST",
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: article.title,
            slug: article.slug,
            content: html,
            excerpt: article.meta_description ?? "",
            status: "publish",
            meta: {
              rank_math_title: article.meta_title,
              rank_math_description: article.meta_description,
            },
          }),
        });
        if (res.ok) {
          const body = (await res.json()) as { id?: number };
          wpPostId = body.id ?? wpPostId;
          channel = "wordpress";
          detail = `Published to ${site}`;
        } else {
          detail = `WordPress responded ${res.status}. Markdown export is ready instead.`;
        }
      } catch {
        detail = "WordPress unreachable. Markdown export is ready instead.";
      }
    }

    const hook = data.webhookUrl || settings?.webhook_url;
    if (channel !== "wordpress" && hook) {
      try {
        await fetch(hook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: article.title,
            slug: article.slug,
            markdown: article.body_markdown,
            meta: {
              title: article.meta_title,
              description: article.meta_description,
            },
            schema: article.schema_json,
            faq: article.faq,
          }),
        });
        channel = "webhook";
        detail = "Sent to your webhook.";
      } catch {
        // keep markdown fallback
      }
    }

    await sql`
      update articles set
        status = 'published',
        published_at = coalesce(published_at, now()),
        wp_post_id = ${wpPostId},
        updated_at = now()
      where id = ${data.id}
    `;
    if (article.keyword_id) {
      await sql`update keywords set status = 'published' where id = ${article.keyword_id}`;
    }
    await log("publish", `Published “${article.title}” (${channel})`);
    return {
      ok: true as const,
      channel,
      detail,
      markdown: article.body_markdown,
      title: article.title,
      slug: article.slug,
    };
  });

export const runAutopilotCycle = createServerFn({ method: "POST" }).handler(
  async () => {
    const sql = await getSql();
    const next = await sql`
      select * from keywords
      where status = 'queued'
      order by opportunity_score desc
      limit 1
    `;
    const kw = next[0] ? mapKeyword(next[0]) : null;
    if (!kw) return { ok: false as const, error: "No queued keywords" };
    const generated = await generateArticleForKeyword(kw.id);
    const settings = (await sql`select frequency_days from settings where id = 1`)[0];
    const days = toNumber(settings?.frequency_days, 1);
    await sql`
      update settings set
        next_run_at = now() + (${days} || ' days')::interval,
        updated_at = now()
      where id = 1
    `;
    return generated;
  },
);

export const generateGbpPosts = createServerFn({ method: "POST" }).handler(
  async () => {
    const sql = await getSql();
    const result = await chatGrok({
      system: VOICE_SYSTEM,
      user: gbpUserPrompt(),
      maxTokens: 1200,
      temperature: 0.5,
    });
    if (!result.ok) return result;
    const parsed = extractJson<{ title: string; body: string; cta: string }[]>(
      result.text,
    );
    if (!parsed?.length) {
      return { ok: false as const, error: "Could not parse GBP posts" };
    }
    let n = 0;
    for (const post of parsed.slice(0, 4)) {
      if (!post.title || !post.body) continue;
      await sql`
        insert into gbp_posts (title, body, cta, scheduled_for)
        values (${post.title}, ${post.body}, ${post.cta ?? "Book now"}, current_date + ${n + 1})
      `;
      n += 1;
    }
    await log("gbp", `Drafted ${n} Google Business Profile posts`);
    return { ok: true as const, inserted: n };
  },
);

export const markGbp = createServerFn({ method: "POST" })
  .validator((input: { id: number; status: GbpPost["status"] }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`update gbp_posts set status = ${data.status} where id = ${data.id}`;
    return { ok: true as const };
  });

function markdownToHtml(md: string): string {
  const escaped = md
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">");
  const lines = escaped.split("\n");
  const out: string[] = [];
  let para: string[] = [];
  const flush = () => {
    if (para.length) {
      out.push(`<p>${para.join(" ")}</p>`);
      para = [];
    }
  };
  for (const line of lines) {
    const t = line.trim();
    if (!t) {
      flush();
      continue;
    }
    if (t.startsWith("### ")) {
      flush();
      out.push(`<h3>${inline(t.slice(4))}</h3>`);
    } else if (t.startsWith("## ")) {
      flush();
      out.push(`<h2>${inline(t.slice(3))}</h2>`);
    } else if (t.startsWith("# ")) {
      flush();
      out.push(`<h1>${inline(t.slice(2))}</h1>`);
    } else if (t.startsWith("- ")) {
      flush();
      out.push(`<li>${inline(t.slice(2))}</li>`);
    } else {
      para.push(inline(t));
    }
  }
  flush();
  return out.join("\n");
}

function inline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, '<a href="$2">$1</a>');
}
