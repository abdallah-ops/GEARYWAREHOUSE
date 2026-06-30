# Geary Warehouse — Project & Chat Context

This file preserves context from development conversations for easy resumption in new or future sessions.

**Current Working Directory:** `/Users/abacha/Documents/GEARYWAREHOUSE` (user copied contents here from the previous "GEARYWAREHOUSE copy" folder)

**Last major update:** 2026-06-30

---

## Project Overview

- **Name:** Geary Warehouse (aka Geary Avenue Warehouse Project)
- **Location:** 209 Geary Ave, Toronto
- **Tech Stack:** Astro 5 (SSR + ISR via Vercel adapter), TypeScript
- **Deployment:** Vercel with ISR (5-minute revalidation)
- **Purpose:** Marketing + events site for an underground warehouse venue (raw concrete, 4-corner sound, kitchen + bar, capacity 256)
- **Key Feature:** Events dynamically loaded from Google Sheet (via SheetDB) and server-rendered for SEO and social previews

---

## Directory Structure (Key Files)

```
GEARYWAREHOUSE/
├── astro.config.mjs
├── public/
│   ├── assets/
│   │   ├── fonts/ (PPNeueMachina)
│   │   ├── img/ (hero.jpg, g1-g8.jpg, geary-logo.png)
│   │   └── video/
│   │       ├── geary-video.mp4          ← current (trimmed)
│   │       └── geary-video-original.mp4 ← backup
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Book.astro
│   │   ├── Events.astro
│   │   ├── Footer.astro
│   │   ├── Gallery.astro
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   ├── NextUp.astro
│   │   ├── Room.astro
│   │   └── TheSpace.astro     ← New video section
│   ├── layouts/
│   │   └── Base.astro         ← Head, SEO, Meta Pixel
│   ├── lib/
│   │   └── events.ts          ← SheetDB fetching + parsing
│   ├── pages/
│   │   └── index.astro
│   └── styles/
│       └── global.css
├── reference/
│   └── index.original.html    ← Original single-file version
├── README.md
├── CONTEXT.md                 ← This file
└── package.json
```

---

## Major Changes Made in This Session

### 1. Video Section (`/04 The Space`)
- Created `src/components/TheSpace.astro`
- Added to `src/pages/index.astro` after `<Gallery />` and before `<Book />`
- **Video specs:**
  - 9:16 vertical (1080x1920)
  - First 1 second cropped (original saved as `geary-video-original.mp4`)
  - Currently ~44.5s long
- **Display decisions:**
  - Narrow player on desktop: `max-width: 440px`
  - Wrapped in `.video-frame` (dark background, border, shadow, padding) for a polished "screen" look
  - `aspect-ratio: 9 / 16`, `object-fit: contain`
  - **Left-aligned under the heading** on desktop (moved inside the same `.wrap` container as the section title for consistent left edge)
  - Responsive widening on smaller screens
- Styles live in `global.css` under `/* === /04 The Space (video section) === */`

### 2. Contact / Booking Email
- Changed from `gawp.events@gmail.com` → `booking@gearywarehouse.com`
- Updated locations:
  - `src/components/Book.astro` (used in mailto link with pre-filled subject/body)
  - `src/components/Footer.astro` (visible link + mailto)
  - `src/components/Header.astro` (const defined, though not directly rendered in nav)
  - `reference/index.original.html` (for reference)

### 3. Meta Pixel (Facebook/Meta)
- Added to `src/layouts/Base.astro` inside `<head>`
- Pixel ID: `1367982078398493`
- Loads **only in production** (`import.meta.env.PROD`)
- Standard Meta Pixel snippet with `is:inline`
- Includes `PageView` + noscript fallback image

### 4. Other Notes
- Booking form is still a `mailto:` link (pre-filled)
- Newsletter link has intentional "newsletteer" spelling in the URL (Audience Republic)
- Socials: Instagram @gearywarehouse, SoundCloud, Discord
- No other analytics/tracking present

---

## Development Workflow

```bash
cd ~/documents/GEARYWAREHOUSE
npm install
npm run dev          # http://localhost:4321
npm run build
npm run preview
```

- Dev server often needs restarting after ~5 minutes in this environment (background task timeout).
- Video assets are served statically from `/public/assets/video/`

---

## Key Implementation Details

### TheSpace Component
- Uses native `<video controls playsinline preload="metadata">`
- No poster image (to show video's own first frame correctly)
- The section title and video share the same `.wrap` for alignment.

### Events System (`src/lib/events.ts`)
- Fetches from SheetDB
- Auto-detects columns
- Flexible date parsing
- Splits into `next` event and `rest`
- Falls back gracefully

### SEO / Structured Data
- Full `MusicVenue` + multiple `Event` JSON-LD in `Base.astro`
- Server-rendered content

---

## How to Resume This Context

In any new chat/session, simply say:

> "We're working on the Geary Warehouse project in ~/documents/GEARYWAREHOUSE. Please read CONTEXT.md for the current state and history."

I can then load this file and have full context.

---

## TODO / Open Items (as of last session)

- [ ] Possibly make Meta Pixel ID an env var (`PUBLIC_META_PIXEL_ID`)
- [ ] Consider adding more Meta Pixel events (e.g. on "request a date" click)
- [ ] Video compression? (currently ~52MB)
- [ ] Update README.md to reflect recent additions (TheSpace section, email change, Meta Pixel)
- [ ] Potential future: real booking form backend instead of mailto

---

Feel free to edit this file as development continues. It is the single source of truth for chat/project continuity.