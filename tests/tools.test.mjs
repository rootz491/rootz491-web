import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  filterTools,
  groupByCategory,
  toolHost,
  toolPath,
} from '../src/lib/tools.ts';

const items = [
  { name: 'JSON', description: 'Format, validate, and minify JSON.', category: 'Dev' },
  { name: 'DNS Lookup', description: 'Resolve A, AAAA, MX records.', category: 'Security/Recon' },
  { name: 'Pastebin', description: 'Share text with expiry.', category: 'Sharing' },
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
