// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://oasen-finder.vercel.app', // wird auf finale Domain umgezogen
  output: 'static',
  integrations: [sitemap()],
  i18n: {
    // Deutsch ist Default ohne Präfix, FR und EN als Sub-Pfade
    defaultLocale: 'de',
    locales: ['de', 'fr', 'en'],
    routing: {
      // Default-Locale liegt unter `/` (kein /de/-Präfix)
      prefixDefaultLocale: false,
    },
  },
  trailingSlash: 'always', // /bewegbar/ statt /bewegbar
  build: {
    // Saubere URL-Struktur für Multi-Page
    format: 'directory',
  },
});
