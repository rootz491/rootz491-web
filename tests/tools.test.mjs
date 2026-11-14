import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

import {
  filterTools,
  groupByCategory,
  normalizeSearch,
  sortTools,
  toolHost,
  toolPath,
} from '../src/lib/tools.ts';

const catalog = JSON.parse(
  readFileSync(new URL('../content/tools.json', import.meta.url), 'utf8')
);
const toolIconSource = readFileSync(
  new URL('../src/components/tools/ToolIcon.tsx', import.meta.url),
  'utf8'
);

// Canonical routes from the tools-hub registry (src/ui.ts TOOLS).
const BROWSER_SLUGS = new Set([
  'json',
  'convert',
  'base64',
  'url',
  'jwt',
  'jwt-sign',
  'chmod',
  'color',
  'ua',
  'timestamp',
  'cron',
  'hash',
  'x509',
  'sshkey',
  'diff',
  'regex',
  'markdown',
  'uuid',
  'qr',
  'password',
  'gst',
  'cidr',
]);

const SERVER_SLUGS = new Set([
  'dns',
  'mail',
  'rdap',
  'rdns',
  'headers',
  'redirects',
  'subdomains',
  'tls',
  'dnssec',
  'mtasts',
  'dane',
  'securitytxt',
  'robots',
  'caa',
  'hsts',
  'rpki',
  'llmstxt',
  'bimi',
  'applinks',
]);

const NEW_SLUGS = [
  'convert',
  'jwt-sign',
  'chmod',
  'color',
  'ua',
  'x509',
  'sshkey',
  'markdown',
  'password',
  'cidr',
  'rdap',
  'dnssec',
  'mtasts',
  'dane',
  'securitytxt',
  'robots',
  'caa',
  'hsts',
  'rpki',
  'llmstxt',
  'bimi',
  'applinks',
];

const items = [
  { name: 'JSON', description: 'Format, validate, and minify JSON.', category: 'Dev' },
  { name: 'DNS Lookup', description: 'Resolve A, AAAA, MX records.', category: 'Security/Recon' },
  { name: 'Pastebin', description: 'Share text with expiry.', category: 'Sharing' },
];

const rich = [
  { name: 'JSON', description: 'Format, validate, and minify JSON.', category: 'Dev', slug: 'json', url: 'https://tools.rootz491.com/t/json' },
  { name: 'Base64', description: 'Encode and decode Base-64 text.', category: 'Dev', slug: 'base64', url: 'https://tools.rootz491.com/t/base64' },
  { name: 'Hash / HMAC', description: 'Compute hashes and HMACs.', category: 'Security/Recon', slug: 'hash-hmac', url: 'https://tools.rootz491.com/t/hash-hmac' },
  { name: 'DNS Lookup', description: 'Resolve A, AAAA, MX records.', category: 'Security/Recon', slug: 'dns-lookup', url: 'https://tools.rootz491.com/t/dns-lookup' },
  { name: 'Café Menu', description: 'Accented title with punctuation.', category: 'Sharing', slug: 'cafe-menu', url: 'https://tools.rootz491.com/t/cafe-menu' },
];

describe('toolHost', () => {
  it('strips a leading www.', () => {
    assert.equal(toolHost('https://www.example.com/t/json'), 'example.com');
  });

  it('keeps the host when there is no www.', () => {
    assert.equal(toolHost('https://tools.rootz491.com/t/json'), 'tools.rootz491.com');
  });

  it('returns the input unchanged when the url is invalid', () => {
    assert.equal(toolHost('not a url'), 'not a url');
  });
});

describe('toolPath', () => {
  it('returns "" for the root path', () => {
    assert.equal(toolPath('https://tools.rootz491.com/'), '');
  });

  it('returns a nested path', () => {
    assert.equal(toolPath('https://tools.rootz491.com/t/json'), '/t/json');
  });

  it('strips a trailing slash', () => {
    assert.equal(toolPath('https://tools.rootz491.com/t/json/'), '/t/json');
  });

  it('returns "" when the url is invalid', () => {
    assert.equal(toolPath('not a url'), '');
  });
});

describe('filterTools', () => {
  it('returns everything for the All category and empty query', () => {
    assert.equal(filterTools(items, 'All', '').length, 3);
  });

  it('filters by category only', () => {
    const result = filterTools(items, 'Security/Recon', '');
    assert.deepEqual(
      result.map(t => t.name),
      ['DNS Lookup']
    );
  });

  it('filters by query case-insensitively', () => {
    const result = filterTools(items, 'All', 'jSoN');
    assert.deepEqual(
      result.map(t => t.name),
      ['JSON']
    );
  });

  it('matches description text', () => {
    const result = filterTools(items, 'All', 'expiry');
    assert.deepEqual(
      result.map(t => t.name),
      ['Pastebin']
    );
  });

  it('treats a whitespace-only query as empty', () => {
    assert.equal(filterTools(items, 'All', '   ').length, 3);
  });

  it('returns no results for a non-matching query', () => {
    assert.deepEqual(filterTools(items, 'All', 'zzz'), []);
  });

  it('applies category and query together', () => {
    assert.deepEqual(filterTools(items, 'Dev', 'dns'), []);
  });
});

describe('groupByCategory', () => {
  it('keeps the provided order', () => {
    const order = ['Sharing', 'Dev', 'Security/Recon'];
    const groups = groupByCategory(items, order);
    assert.deepEqual(
      groups.map(g => g.category),
      order
    );
  });

  it('skips empty groups', () => {
    const groups = groupByCategory(items, ['Dev', 'Finance/India', 'Sharing']);
    assert.deepEqual(
      groups.map(g => g.category),
      ['Dev', 'Sharing']
    );
  });

  it('assigns the correct items to each group', () => {
    const groups = groupByCategory(items, ['Dev', 'Sharing']);
    assert.deepEqual(
      groups.map(g => g.items.map(t => t.name)),
      [['JSON'], ['Pastebin']]
    );
  });
});

describe('normalizeSearch', () => {
  it('lowercases and collapses non-alphanumerics to single spaces', () => {
    assert.equal(normalizeSearch('  Hello--World!!  '), 'hello world');
  });

  it('strips diacritics via NFKD', () => {
    assert.equal(normalizeSearch('Café'), 'cafe');
  });

  it('returns "" for punctuation-only input', () => {
    assert.equal(normalizeSearch('!!!...///'), '');
  });
});

describe('filterTools search', () => {
  it('ignores a punctuation-only query', () => {
    assert.equal(filterTools(rich, 'All', '!!!').length, rich.length);
  });

  it('matches diacritic-insensitive text', () => {
    assert.deepEqual(filterTools(rich, 'All', 'cafe').map(t => t.name), ['Café Menu']);
  });

  it('matches all tokens across fields ("hash hmac")', () => {
    assert.deepEqual(filterTools(rich, 'All', 'hash hmac').map(t => t.name), ['Hash / HMAC']);
  });

  it('treats "/" like a space ("hash/hmac")', () => {
    assert.deepEqual(filterTools(rich, 'All', 'hash/hmac').map(t => t.name), ['Hash / HMAC']);
  });

  it('matches the compacted haystack ("hashhmac")', () => {
    assert.deepEqual(filterTools(rich, 'All', 'hashhmac').map(t => t.name), ['Hash / HMAC']);
  });

  it('normalizes hyphens in the query ("Base-64")', () => {
    assert.deepEqual(filterTools(rich, 'All', 'Base-64').map(t => t.name), ['Base64']);
  });

  it('matches the tool host + path ("tools.rootz491.com/t/json")', () => {
    assert.deepEqual(
      filterTools(rich, 'All', 'tools.rootz491.com/t/json').map(t => t.name),
      ['JSON']
    );
  });

  it('matches a partial path ("t/json")', () => {
    assert.deepEqual(filterTools(rich, 'All', 't/json').map(t => t.name), ['JSON']);
  });

  it('matches the slug ("dns-lookup")', () => {
    assert.deepEqual(filterTools(rich, 'All', 'dns-lookup').map(t => t.name), ['DNS Lookup']);
  });

  it('matches the compacted slug ("dnslookup")', () => {
    assert.deepEqual(filterTools(rich, 'All', 'dnslookup').map(t => t.name), ['DNS Lookup']);
  });

  it('applies category and query together', () => {
    assert.deepEqual(filterTools(rich, 'Dev', 'base64').map(t => t.name), ['Base64']);
  });

  it('preserves input order', () => {
    const ordered = [
      { name: 'Beta', description: 'b', category: 'Dev' },
      { name: 'Alpha', description: 'a', category: 'Dev' },
      { name: 'Gamma', description: 'g', category: 'Dev' },
    ];
    assert.deepEqual(
      filterTools(ordered, 'All', 'a').map(t => t.name),
      ['Beta', 'Alpha', 'Gamma']
    );
  });
});

describe('sortTools', () => {
  it('returns a copy in original order for "default"', () => {
    const out = sortTools(rich, 'default');
    assert.deepEqual(out.map(t => t.name), rich.map(t => t.name));
    assert.notEqual(out, rich);
  });

  it('sorts by name case-insensitively and stably', () => {
    const input = [
      { name: 'banana' },
      { name: 'Apple' },
      { name: 'apricot' },
      { name: 'Apple' },
    ];
    assert.deepEqual(
      sortTools(input, 'name').map(t => t.name),
      ['Apple', 'Apple', 'apricot', 'banana']
    );
  });

  it('sorts numeric runs numerically', () => {
    const input = [{ name: 'Item 10' }, { name: 'Item 2' }];
    assert.deepEqual(sortTools(input, 'name').map(t => t.name), ['Item 2', 'Item 10']);
  });

  it('never mutates the input array', () => {
    const input = [{ name: 'b' }, { name: 'a' }];
    sortTools(input, 'name');
    assert.deepEqual(input.map(t => t.name), ['b', 'a']);
  });
});

describe('tools catalog', () => {
  it('includes every newly shipped tool', () => {
    const slugs = new Set(catalog.items.map(t => t.slug));
    for (const slug of NEW_SLUGS) {
      assert.ok(slugs.has(slug), `missing catalog item: ${slug}`);
    }
  });

  it('includes the representative sample', () => {
    const slugs = new Set(catalog.items.map(t => t.slug));
    for (const slug of ['sshkey', 'robots', 'cidr', 'jwt-sign', 'password']) {
      assert.ok(slugs.has(slug), `missing representative tool: ${slug}`);
    }
  });

  it('has no duplicate slugs or urls', () => {
    assert.equal(
      new Set(catalog.items.map(t => t.slug)).size,
      catalog.items.length
    );
    assert.equal(
      new Set(catalog.items.map(t => t.url)).size,
      catalog.items.length
    );
  });

  it('points every new tool at its real tools-hub route', () => {
    const bySlug = new Map(catalog.items.map(t => [t.slug, t]));
    for (const slug of NEW_SLUGS) {
      const tool = bySlug.get(slug);
      assert.ok(tool, `missing catalog item: ${slug}`);
      const kind = BROWSER_SLUGS.has(slug) ? 't' : 'r';
      assert.equal(tool.url, `https://tools.rootz491.com/${kind}/${slug}`);
    }
  });

  it('only links to tools that exist on tools-hub', () => {
    const known = new Set([...BROWSER_SLUGS, ...SERVER_SLUGS]);
    const legacy = new Set(['tools-hub', 'paste', 'request-bin']);

    for (const tool of catalog.items) {
      if (legacy.has(tool.slug)) continue;
      const { hostname, pathname } = new URL(tool.url);
      assert.equal(hostname, 'tools.rootz491.com');
      const match = /^\/(t|r)\/([a-z0-9-]+)$/.exec(pathname);
      assert.ok(match, `not a tools-hub route: ${tool.url}`);
      const [, kind, routeSlug] = match;
      assert.ok(known.has(routeSlug), `unknown tools-hub slug: ${routeSlug}`);
      const expectedKind = BROWSER_SLUGS.has(routeSlug) ? 't' : 'r';
      assert.equal(kind, expectedKind, `wrong route kind: ${tool.url}`);
    }
  });

  it('keeps categories consistent with the route kind', () => {
    const legacy = new Set(['tools-hub', 'paste', 'request-bin']);

    for (const tool of catalog.items) {
      if (legacy.has(tool.slug)) continue;
      if (tool.slug === 'gst') {
        assert.equal(tool.category, 'Finance/India');
        continue;
      }
      const { pathname } = new URL(tool.url);
      const expected = pathname.startsWith('/r/') ? 'Security/Recon' : 'Dev';
      assert.equal(tool.category, expected, tool.slug);
    }
  });

  it('lists the new recon tools on their /r/ routes', () => {
    const newRecon = ['llmstxt', 'bimi', 'applinks'];
    const bySlug = new Map(catalog.items.map(t => [t.slug, t]));

    for (const slug of newRecon) {
      const tool = bySlug.get(slug);
      assert.ok(tool, `missing catalog item: ${slug}`);
      assert.ok(
        tool.url.startsWith('https://tools.rootz491.com/r/'),
        `wrong route for ${slug}: ${tool.url}`
      );
      assert.equal(tool.url, `https://tools.rootz491.com/r/${slug}`);
      assert.equal(tool.category, 'Security/Recon');
    }
  });

  it('uses a mapped Lucide icon for every tool', () => {
    for (const tool of catalog.items) {
      assert.match(
        toolIconSource,
        new RegExp(`\\b${tool.icon}\\b`),
        `icon not mapped for ${tool.slug}: ${tool.icon}`
      );
    }
  });
});
