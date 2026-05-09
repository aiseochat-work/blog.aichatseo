import cloudflare from '@astrojs/cloudflare';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'https://blog.aichatseo.com',
  output: 'server',
  // 'cloudflare' image service can break Cloudflare builds (emitAsset / Vite externals).
  adapter: cloudflare({
    imageService: 'passthrough',
  }),
  integrations: [tailwind()],
  session: {
    driver: 'unstorage/drivers/null',
  },
});
