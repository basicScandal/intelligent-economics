import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

/** Per-route sitemap hints. Keys are pathnames without a trailing slash. */
const ROUTE_HINTS = {
  '': { priority: 1.0, changefreq: 'weekly' },
  '/whitepaper': { priority: 0.9, changefreq: 'monthly' },
  '/dashboard': { priority: 0.9, changefreq: 'weekly' },
  '/story': { priority: 0.8, changefreq: 'monthly' },
  '/compare': { priority: 0.8, changefreq: 'monthly' },
  '/dual-currency': { priority: 0.7, changefreq: 'monthly' },
  '/resources': { priority: 0.7, changefreq: 'monthly' },
  '/privacy': { priority: 0.2, changefreq: 'yearly' },
};

export default defineConfig({
  site: 'https://intelligenteconomics.ai',
  // Emit /page/index.html and link to /page/ so canonical URLs and hrefs agree.
  trailingSlash: 'always',
  integrations: [
    mdx({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
      remarkRehype: { footnoteLabel: 'References' },
    }),
    sitemap({
      lastmod: new Date(),
      serialize(item) {
        const path = new URL(item.url).pathname.replace(/\/$/, '');
        return { ...item, ...(ROUTE_HINTS[path] ?? { priority: 0.6, changefreq: 'monthly' }) };
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
