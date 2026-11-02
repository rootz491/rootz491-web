import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { isPlainAnchor } from '../src/lib/nav.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = rel => readFileSync(path.join(root, rel), 'utf8');

describe('plain anchor hrefs', () => {
  it('treats PDFs, remote URLs and mailto links as plain anchors', () => {
    for (const href of [
      '/resume/karan-sharma-resume.pdf',
      '/resume/karan-sharma-resume.pdf?download=1',
      '/resume/karan-sharma-resume.pdf#page=1',
      'https://example.com',
      'http://example.com',
      'mailto:rootz491@wearehackerone.com',
    ]) {
      assert.equal(isPlainAnchor(href), true, href);
    }
  });

  it('keeps app routes on next/link', () => {
    for (const href of ['/', '/projects', '/tools', '/about', '/about#skills']) {
      assert.equal(isPlainAnchor(href), false, href);
    }
  });
});

describe('Header resume and nav links', () => {
  it('never wraps the resume href in next/link', () => {
    const source = read('src/components/layout/Header.tsx');
    assert.doesNotMatch(source, /<Link[^>]*site\.nav\.resume\.href/);
    assert.match(source, /<a[\s\S]*?href=\{site\.nav\.resume\.href\}/);
  });

  it('renders PDF and remote nav links as plain anchors', () => {
    const source = read('src/components/layout/Header.tsx');
    assert.equal(source.match(/isPlainAnchor\(link\.href\)/g)?.length, 2);
    assert.doesNotMatch(source, /<Link[^>]*href=\{link\.href\}[\s\S]{0,80}\.pdf/);
  });

  it('uses the same guard in the shared Button primitive', () => {
    const source = read('src/components/ui/primitives.tsx');
    assert.match(source, /isPlainAnchor\(href\)/);
    assert.doesNotMatch(source, /resume/i);
  });
});
