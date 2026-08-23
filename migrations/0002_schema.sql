create table if not exists settings (
  id integer primary key check (id = 1),
  site_url text not null default 'https://smartmount.ca',
  cms_type text not null default 'wordpress',
  publish_mode text not null default 'approve',
  frequency_days integer not null default 1,
  autopilot_on boolean not null default false,
  onboarded boolean not null default false,
  gbp_connected boolean not null default false,
  gsc_connected boolean not null default false,
  language_pref text not null default 'en',
  webhook_url text,
  brand_learned_at timestamptz,
  next_run_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists brand_profile (
  id integer primary key check (id = 1),
  voice_summary text not null,
  services jsonb not null default '[]'::jsonb,
  service_areas jsonb not null default '[]'::jsonb,
  differentiators jsonb not null default '[]'::jsonb,
  pricing_notes text not null default '',
  testimonials jsonb not null default '[]'::jsonb,
  cta_language text not null default '',
  scraped_excerpt text,
  updated_at timestamptz not null default now()
);

create table if not exists keywords (
  id serial primary key,
  keyword text not null unique,
  category text not null,
  intent text not null,
  suburb text,
  language text not null default 'en',
  volume_score integer not null,
  competition_score integer not null,
  conversion_score integer not null,
  opportunity_score integer not null,
  status text not null default 'queued',
  paa_questions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists articles (
  id serial primary key,
  keyword_id integer references keywords(id),
  title text not null,
  slug text not null unique,
  language text not null default 'en',
  status text not null default 'draft',
  meta_title text,
  meta_description text,
  h1 text,
  outline jsonb not null default '[]'::jsonb,
  body_markdown text not null,
  faq jsonb not null default '[]'::jsonb,
  schema_json text,
  image_url text,
  image_alt text,
  image_prompt text,
  internal_links jsonb not null default '[]'::jsonb,
  word_count integer,
  scheduled_for date,
  published_at timestamptz,
  wp_post_id integer,
  impressions integer not null default 0,
  clicks integer not null default 0,
  avg_position numeric,
  estimated_bookings numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists metrics_daily (
  day date primary key,
  impressions integer not null,
  clicks integer not null,
  avg_position numeric not null,
  ctr numeric not null,
  estimated_bookings numeric not null default 0
);

create table if not exists competitors (
  id serial primary key,
  name text not null,
  url text,
  notes text,
  threat text not null default 'medium',
  overlapping_keywords integer not null default 0,
  last_seen text
);

create table if not exists gbp_posts (
  id serial primary key,
  title text not null,
  body text not null,
  cta text,
  status text not null default 'suggested',
  scheduled_for date,
  created_at timestamptz not null default now()
);

create table if not exists activity_log (
  id serial primary key,
  kind text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists keywords_opp_idx on keywords (opportunity_score desc);
create index if not exists articles_status_idx on articles (status, scheduled_for);
