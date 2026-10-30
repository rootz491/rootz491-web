import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = rel => readFileSync(path.join(root, rel), 'utf8');

const standalonePages = [
  ['projects', 'src/app/projects/page.tsx', 'src/components/sections/ProjectsSection.tsx'],
  ['blog', 'src/app/blog/page.tsx', 'src/components/sections/BlogsSection.tsx'],
  ['about', 'src/app/about/page.tsx', 'src/components/sections/AboutSection.tsx'],
  ['contact', 'src/app/contact/page.tsx', 'src/components/sections/ContactSection.tsx'],
];

describe('tailwind hover gating', () => {
  it('enables hoverOnlyWhenSupported', () => {
    const config = require('../tailwind.config.js');
    assert.equal(config.future?.hoverOnlyWhenSupported, true);
  });
});

describe('standalone page h1s', () => {
  for (const [name, pageFile, sectionFile] of standalonePages) {
    it(`renders the ${name} page title as an h1`, () => {
      assert.match(read(pageFile), /headingAs\s*=\s*['"]h1['"]/);
      assert.match(read(sectionFile), /headingAs\?:\s*['"]h1['"]\s*\|\s*['"]h2['"]/);
      assert.match(read(sectionFile), /as=\{headingAs\}/);
    });
  }

  it('keeps the shared heading default at h2 for the home page', () => {
    assert.match(read('src/components/ui/primitives.tsx'), /as\?: 'h1' \| 'h2'/);
    assert.match(read('src/components/ui/primitives.tsx'), /as: Heading = 'h2'/);
    assert.doesNotMatch(read('src/app/page.tsx'), /headingAs/);
  });
});

describe('custom 404', () => {
  it('exists and exports the not-found metadata title', () => {
    const source = read('src/app/not-found.tsx');
    assert.match(source, /export const metadata/);
    assert.match(source, /Not found — Karan Sharma/);
  });

  it('has exactly one h1 and links home', () => {
    const source = read('src/app/not-found.tsx');
    assert.equal(source.match(/<h1[\s>]/g)?.length, 1);
    assert.match(source, /href='\/'/);
  });
});
