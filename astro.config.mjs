import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'https://blog.aichatseo.com',
  output: 'static',
  // 'cloudflare' image service can break Cloudflare builds (emitAsset / Vite externals).
  adapter: cloudflare({
    imageService: 'passthrough',
  }),
  integrations: [tailwind(), mdx()],
  // Prevent @astrojs/cloudflare from injecting SESSION KV when Astro.session isn't used.
  session: {
    driver: 'unstorage/drivers/null',
  },
});
