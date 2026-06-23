import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// Public site URL — update to the real domain once it's live.
// Used for canonical links, Open Graph, and sitemap.
const SITE = process.env.PUBLIC_SITE_URL || 'https://gearywarehouse.vercel.app';

export default defineConfig({
  site: SITE,
  output: 'server',
  adapter: vercel({
    // Incremental Static Regeneration: cache the rendered page and
    // refresh it at most once every 5 minutes, so new rows in the
    // events sheet appear automatically without a manual rebuild.
    isr: {
      expiration: 300,
    },
  }),
});
