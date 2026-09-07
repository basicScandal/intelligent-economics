#!/usr/bin/env node
/**
 * Static link checker for the built site.
 *
 * Run after `npm run build`. Walks every HTML file in dist/ and verifies:
 *   - internal hrefs/srcs resolve to a real file or directory index
 *   - same-page #anchors point at an id/name that exists on that page
 *   - cross-page #anchors point at an id that exists on the target page
 *   - internal links carry the trailing slash the build actually serves,
 *     so pages never link through a redirect
 *
 * External URLs are collected and listed, and only fetched with --external
 * (network access is not assumed in CI).
 *
 * Exits non-zero if anything is broken, so it can gate a deploy.
 *
 * Usage:
 *   node scripts/check-links.mjs [--dist=dist] [--external] [--quiet]
 */

import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const opt = (name, fallback) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};

const DIST = opt('dist', 'dist');
const CHECK_EXTERNAL = flag('external');
const QUIET = flag('quiet');

if (!fs.existsSync(DIST)) {
  console.error(`✗ ${DIST}/ not found — run \`npm run build\` first.`);
  process.exit(1);
}

/** Attributes worth following. */
const LINK_ATTRS = /(?:href|src)\s*=\s*"([^"]*)"/g;
/** Script and style bodies contain JS template literals that look like links. */
const INLINE_CODE = /<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi;

/** Every HTML file in the build. */
function htmlFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...htmlFiles(p));
    else if (entry.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const files = htmlFiles(DIST).sort();
/** file -> Set of anchorable ids on that page */
const anchors = new Map();
/** file -> array of raw link targets */
const links = new Map();

for (const file of files) {
  const raw = fs.readFileSync(file, 'utf8');
  const markup = raw.replace(INLINE_CODE, '');

  const ids = new Set();
  for (const m of markup.matchAll(/\sid="([^"]+)"/g)) ids.add(m[1]);
  for (const m of markup.matchAll(/<a\b[^>]*\sname="([^"]+)"/g)) ids.add(m[1]);
  anchors.set(file, ids);

  links.set(file, [...markup.matchAll(LINK_ATTRS)].map((m) => m[1]));
}

/** Map a site path to the file that serves it, or null. */
function servedBy(target) {
  const asFile = path.join(DIST, target);
  if (fs.existsSync(asFile) && fs.statSync(asFile).isFile()) return asFile;
  const asDir = path.join(DIST, target, 'index.html');
  if (fs.existsSync(asDir)) return asDir;
  const asHtml = path.join(DIST, `${target}.html`);
  if (fs.existsSync(asHtml)) return asHtml;
  return null;
}

const errors = [];
const warnings = [];
const external = new Set();

for (const file of files) {
  const pageAnchors = anchors.get(file);
  const seen = new Set();

  for (const url of links.get(file)) {
    if (seen.has(url)) continue;
    seen.add(url);

    if (url === '') continue;
    if (/^(mailto:|tel:|data:|javascript:|blob:|#$)/i.test(url)) continue;

    if (/^(https?:)?\/\//i.test(url)) {
      external.add(url.replace(/^\/\//, 'https://'));
      continue;
    }

    // Same-page anchor
    if (url.startsWith('#')) {
      const id = decodeURIComponent(url.slice(1));
      if (id && !pageAnchors.has(id)) {
        errors.push({ file, url, why: `no element with id="${id}" on this page` });
      }
      continue;
    }

    const [pathPart, hash] = url.split('#');
    const cleanPath = pathPart.split('?')[0];

    // Resolve relative to the site root or to the current page's directory.
    const target = cleanPath.startsWith('/')
      ? cleanPath
      : path.posix.join(path.posix.dirname(path.relative(DIST, file)), cleanPath);

    const normalised = target.replace(/^\/+/, '');
    const servedFile = servedBy(normalised);

    if (!servedFile) {
      errors.push({ file, url, why: `nothing in ${DIST}/ serves this path` });
      continue;
    }

    // Directory routes must be linked with a trailing slash, otherwise the
    // host answers with a 301 and the link costs an extra round trip.
    const isDirectoryRoute = servedFile.endsWith(`${path.sep}index.html`);
    if (isDirectoryRoute && cleanPath !== '/' && !cleanPath.endsWith('/')) {
      warnings.push({ file, url, why: `links through a redirect — use "${cleanPath}/"` });
    }

    if (hash) {
      const id = decodeURIComponent(hash);
      const targetAnchors = anchors.get(servedFile);
      if (targetAnchors && !targetAnchors.has(id)) {
        errors.push({
          file,
          url,
          why: `no element with id="${id}" in ${path.relative(DIST, servedFile)}`,
        });
      }
    }
  }
}

// Optional external check — off by default, CI runners are often egress-limited.
const externalFailures = [];
if (CHECK_EXTERNAL) {
  const targets = [...external].filter((u) => !u.startsWith('https://intelligenteconomics.ai'));
  for (const url of targets) {
    try {
      const res = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        headers: { 'User-Agent': 'intelligent-economics-link-check' },
        signal: AbortSignal.timeout(20000),
      });
      if (res.status >= 400) externalFailures.push({ url, status: res.status });
      if (!QUIET) console.log(`  ${res.status}  ${url}`);
    } catch (err) {
      externalFailures.push({ url, status: err.name === 'TimeoutError' ? 'timeout' : 'unreachable' });
    }
  }
}

// ── Report ────────────────────────────────────────────────────────────────
const totalLinks = [...links.values()].reduce((n, l) => n + l.length, 0);
console.log(`\nLink check — ${files.length} pages, ${totalLinks} links, ${external.size} external targets`);

if (warnings.length) {
  console.log(`\n⚠ ${warnings.length} redirect-causing link(s):`);
  for (const w of warnings) console.log(`  ${path.relative(DIST, w.file)}  →  ${w.url}\n    ${w.why}`);
}

if (errors.length) {
  console.log(`\n✗ ${errors.length} broken link(s):`);
  for (const e of errors) console.log(`  ${path.relative(DIST, e.file)}  →  ${e.url}\n    ${e.why}`);
}

if (externalFailures.length) {
  console.log(`\n✗ ${externalFailures.length} unreachable external link(s):`);
  for (const f of externalFailures) console.log(`  ${f.status}  ${f.url}`);
}

if (!errors.length && !externalFailures.length) {
  console.log(warnings.length ? '\n✓ No broken links (warnings above).' : '\n✓ No broken links.');
}

if (!CHECK_EXTERNAL && !QUIET) {
  console.log('\nExternal links (not fetched — re-run with --external):');
  for (const u of [...external].sort()) console.log(`  ${u}`);
}

process.exit(errors.length || externalFailures.length ? 1 : 0);
