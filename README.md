# SmartMount SEO Autopilot

Private content engine for [smartmount.ca](https://smartmount.ca). Finds the
local keywords Ottawa and Gatineau homeowners actually type, writes pages in
Smart Mount’s voice, and queues them for the live site.

Built for Sam — not a generic SEO dashboard.

## What it does

- **Keywords** — ranked opportunities by suburb, intent, and commercial work
- **Content** — draft, review, and approve articles in Smart Mount’s voice
- **Calendar** — one-a-day publishing cadence
- **Visibility** — impressions, clicks, and estimated bookings
- **GBP / competitors** — Maps posts and local competitor watch
- **Publish** — WordPress / webhook when you are ready to go live

## First run

1. Open the site and complete the 5-minute setup.
2. Scan keywords, then generate the first article from a high-opportunity term.
3. Review the draft, approve it, and keep Autopilot on if you want a daily page.

## Deploy (Vercel)

This is a TanStack Start + Vite app. After the GitHub repo is connected:

1. Framework: Vite. Build command: `npm run build`.
2. Add these environment variables (Production + Preview):

   | Variable | Required | Purpose |
   |---|---|---|
   | `DATABASE_URL` | Yes | Neon Postgres connection string. Without it, data does not persist. |
   | `XAI_API_KEY` | Yes | Grok writes the articles. Get a key at [console.x.ai](https://console.x.ai). |
   | `VITE_AUTH_ENABLED` | Set to `false` | This tool has no public sign-in. Leave auth off. |

3. Create a free Neon database at [neon.tech](https://neon.tech), copy the
   pooled connection string into `DATABASE_URL`, and redeploy.
4. Serverless max duration should be **60–120 seconds** so a full article
   write is not cut off.

Keep the Vercel project private (Vercel Authentication on). The dashboard is
world-writable without a login.

## Local

```bash
npm install
npm run dev
```
