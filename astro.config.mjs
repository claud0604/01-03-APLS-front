import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://apls.kr',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ja', 'zh', 'ko'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [sitemap()],
});
