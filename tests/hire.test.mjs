import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import { HireSchema } from '../src/lib/content/types.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = rel => readFileSync(path.join(root, rel), 'utf8');
const json = rel => JSON.parse(read(rel));

const hire = HireSchema.parse(json('content/hire.json'));
const hireText = JSON.stringify(hire);
const hireFiles = [
  'content/hire.json',
  'src/app/hire/page.tsx',
  'src/components/sections/HireSection.tsx',
].map(read);

function collectStrings(value, out = []) {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value))
    value.forEach(item => collectStrings(item, out));
  else if (value && typeof value === 'object') {
    Object.values(value).forEach(item => collectStrings(item, out));
  }
  return out;
}

describe('hire page content', () => {
  it('names Karan, the alias, and city-level location only', () => {
    assert.match(hire.intro, /Karan Sharma/);
    assert.match(hire.intro, /rootz491/);
    assert.equal(hire.location, 'Dehradun, Uttarakhand, India');
    assert.match(hire.timezone, /UTC\+5:30/);
    const copy = collectStrings(hire).join('\n');
    assert.doesNotMatch(
      copy,
      /\b(street|road|lane|nagar|pincode|pin code|zip)\b/i
    );
    assert.doesNotMatch(copy, /\b(phone|gstin|ifsc|iban|swift|dob)\b/i);
    assert.doesNotMatch(copy, /date of birth/i);
    assert.doesNotMatch(copy, /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    assert.doesNotMatch(copy, /\d[\d\s().-]{7,}\d/);
  });

  it('links only the public contacts and does not invent a form or email', () => {
    assert.deepEqual(
      hire.contacts.items.map(item => item.href),
      [
        'https://t.me/rootz491',
        'https://github.com/rootz491',
        'https://blog.rootz491.com',
        'https://rootz491.com',
      ]
    );
    assert.equal(hire.contacts.items[0].detail, '@rootz491');
    assert.equal(hire.ctas[0].href, 'https://t.me/rootz491');
    assert.doesNotMatch(hireText, /mailto:/i);
    assert.doesNotMatch(
      read('src/components/sections/HireSection.tsx'),
      /<form/i
    );
  });

  it('points at work already on the site without naming employers or clients', () => {
    assert.equal(hire.ctas[1].href, '/projects');
    assert.equal(hire.elsewhere.href, '/tools');
    const employers = json('content/experience.json').items.map(
      item => item.company
    );
    const banned = [
      ...employers,
      'supercoloring',
      'pov.after.hours',
      'instagram',
      'devin',
      'testimonial',
      'kaluwala',
      'explorewithnurse',
    ];
    for (const name of banned) {
      assert.equal(
        hireText.toLowerCase().includes(name.toLowerCase()),
        false,
        name
      );
    }
    assert.doesNotMatch(hireText, /\b(rates?|per hour|\/hr)\b/i);
    assert.doesNotMatch(hireText, /[$₹€£]/);
    assert.doesNotMatch(hireText, /\byears?\b/i);
    assert.doesNotMatch(hireText, /\bcursor\b/i);
  });

  it('keeps a light personal note and the public tool link', () => {
    assert.match(hire.personal, /trek/i);
    assert.match(hire.personal, /badminton/i);
    assert.match(hire.personal, /film/i);
    assert.match(hire.elsewhere.intro, /paste/i);
    assert.match(hire.elsewhere.intro, /bin/i);
  });
});

describe('hire page wiring', () => {
  it('adds Hire to the shared navigation', () => {
    const link = json('content/site.json').nav.links.find(
      item => item.href === '/hire'
    );
    assert.deepEqual(link, { label: 'Hire', href: '/hire' });
  });

  it('lists /hire in the sitemap', () => {
    assert.match(read('src/app/sitemap.ts'), /\/hire/);
  });

  it('lets the collapsed menu scroll while Lenis is stopped', () => {
    const source = read('src/components/layout/Header.tsx');
    const list = source.slice(source.indexOf("id='mobile-menu'"));
    assert.match(list, /data-lenis-prevent/);
    assert.match(list, /overflow-y-auto/);
    assert.match(list, /max-h-\[calc\(100vh-64px\)\]/);
  });

  it('shows the full nav from the lg breakpoint so the extra link fits', () => {
    const source = read('src/components/layout/Header.tsx');
    assert.match(source, /hidden items-center gap-8 lg:flex/);
    assert.match(source, /lg:hidden/);
    assert.doesNotMatch(source, /md:flex|md:hidden/);
    assert.match(
      source,
      /pathname === link\.href \? 'text-cream' : 'text-cream-muted'/
    );
  });

  it('uses one h1, existing motion, and no scroll snap', () => {
    const page = read('src/app/hire/page.tsx');
    const section = read('src/components/sections/HireSection.tsx');
    assert.match(page, /headingAs=['"]h1['"]/);
    assert.match(section, /as=\{headingAs\}/);
    assert.doesNotMatch(section, /scroll-snap|whileHover/);
    assert.match(section, /pointer-hover:/);
    assert.match(section, /motion-reduce:pointer-hover:translate-y-0/);
    for (const source of hireFiles) {
      assert.doesNotMatch(source, /scroll-snap/);
    }
  });
});
