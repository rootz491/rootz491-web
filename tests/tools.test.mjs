import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  filterTools,
  groupByCategory,
  normalizeSearch,
  sortTools,
  toolHost,
  toolPath,
} from '../src/lib/tools.ts';

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
