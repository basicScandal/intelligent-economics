/**
 * Site-wide SEO constants and URL helpers.
 *
 * Every absolute URL emitted in <head> (canonical, og:url, og:image, JSON-LD @id)
 * runs through here so the production origin is defined in exactly one place.
 */

export const SITE = {
  name: 'Intelligent Economics',
  url: 'https://intelligenteconomics.ai',
  /** Used whenever a page does not supply its own description. */
  description:
    'GDP counts a cancer diagnosis as growth. The MIND Index measures prosperity as Material × Intelligence × Network × Diversity — open data for 217 countries, open methodology, and a pilot city to prove it.',
  /** 1200×630 social card used unless a page overrides it. */
  defaultImage: '/og-default.png',
  repo: 'https://github.com/basicScandal/intelligent-economics',
} as const;

/** Resolve a site-relative path to an absolute URL; pass through absolute URLs. */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return new URL(path, SITE.url).toString();
}

/**
 * Canonical URL for a page.
 *
 * Normalises to the shape the static build actually serves: a trailing slash on
 * directory routes, no trailing slash on the root, and query/hash stripped so
 * `/dashboard?scale=city` does not compete with `/dashboard/` in the index.
 */
export function canonicalFor(url: URL | string): string {
  const pathname = typeof url === 'string' ? url : url.pathname;
  let clean = pathname.split('?')[0].split('#')[0];
  if (clean === '' || clean === '/') return `${SITE.url}/`;
  clean = clean.replace(/\/index\.html$/, '/');
  if (!clean.endsWith('/')) clean += '/';
  return new URL(clean, SITE.url).toString();
}
