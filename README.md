# Geary Warehouse

Marketing + events site for Geary Warehouse (209 Geary Ave, Toronto), built with [Astro](https://astro.build) and deployed on Vercel.

Events are pulled automatically from a Google Sheet (via SheetDB) and rendered **on the server** so they appear in the page HTML — crawlable by search engines and visible in link previews. The page is cached with **ISR** and refreshes at most every 5 minutes, so new rows in the sheet go live on their own with no rebuild.

## Run locally

```bash
npm install
npm run dev      # http://localhost:4321
```

Other commands:

```bash
npm run build    # production build (.vercel/output)
npm run preview  # preview the build
```

> Requires Node 18+.

## Project structure

```
public/assets/        images + fonts (served as-is)
public/favicon.svg
src/layouts/Base.astro      <head>, SEO meta (OG/Twitter), JSON-LD slot
src/components/             Header, Hero, NextUp, Events, Room, Gallery, Book, Footer
src/lib/events.ts          server-side SheetDB fetch + parse/normalize
src/pages/index.astro      assembles the page, builds schema.org data
astro.config.mjs           Vercel adapter + ISR (5-min revalidate)
reference/index.original.html   the pre-Astro single-file version (kept for reference)
```

## Events feed

- Source sheet → SheetDB endpoint, set in `src/lib/events.ts` (`FEED_URL`).
  You can override it without editing code via the `PUBLIC_EVENTS_FEED_URL` env var.
- Columns are **auto-detected** (date / name / ticket-url / meta). To force a
  specific sheet header, fill in `COLS` in `src/lib/events.ts`.
- **Keep the date column in `YYYY-MM-DD` format** for reliable sorting. (Bare
  values like "July 18" with no year can resolve to the wrong year.)
- If the feed is ever unreachable, the page falls back to a single placeholder
  event so it never renders empty.

## Deploy to Vercel

1. Push this folder to a Git repo (GitHub/GitLab/Bitbucket).
2. In Vercel: **New Project → import the repo.** Framework preset auto-detects
   **Astro**; no extra build settings needed (the `@astrojs/vercel` adapter
   handles output + ISR).
3. Set environment variables (Project → Settings → Environment Variables):
   - `PUBLIC_SITE_URL` → the final domain (e.g. `https://gearywarehouse.com`).
     Used for canonical URLs, Open Graph, and structured data.
   - `PUBLIC_EVENTS_FEED_URL` → *(optional)* override the SheetDB endpoint.
4. Deploy. Add the custom domain under **Settings → Domains**.

## Tweaking the ISR interval

In `astro.config.mjs`, `isr.expiration` is in seconds (currently `300` = 5 min).
Lower it for fresher events, raise it to cut serverless invocations.

## What changed from the original

Converted the single `index.html` to Astro components and added: server-rendered
(crawlable) events, schema.org `MusicVenue` + `Event` structured data, Open
Graph/Twitter cards, favicon, a working **mobile nav** (the old one disappeared on
phones), a skip-link, descriptive gallery alt text, a higher-contrast footer, a
pre-filled booking email (still `mailto:`, no form), and the corrected newsletter
link (was a typo — please confirm it resolves).
