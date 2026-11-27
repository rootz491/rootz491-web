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
const projects = json('content/projects.json');
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
  it('uses the signed-off headline, intro, price, and availability', () => {
    assert.equal(hire.headline, 'I build your product, from MVP to launch.');
    assert.match(hire.intro, /I'm Karan, a full-stack developer with 4\+ years/);
    assert.match(hire.intro, /I'm available for new projects now/);
    assert.match(hire.traveller, /travel/i);
    assert.equal(
      hire.pricing.body,
      '€20/hour. One-off projects are quoted from your requirements after a short call, so there are no fixed package prices. You get a written scope and estimate before any work starts.'
    );
    assert.equal(hire.process.location, 'Based in India (IST, UTC+5:30).');
  });

  it('lists the three packages, with MVP to launch first', () => {
    assert.deepEqual(
      hire.packages.items.map(item => item.title),
      [
        'MVP to launch',
        'Deployment and DevOps setup',
        'AI integration into an existing product',
      ]
    );
    assert.equal(hire.packages.items[0].lead, true);
    assert.match(hire.packages.items[0].points.join(' '), /Next\.js\/React/);
    assert.match(hire.packages.items[1].points.join(' '), /Docker/);
    assert.match(hire.packages.items[2].points.join(' '), /cost-per-request/);
  });

  it('describes the four-step process and omits overlap hours', () => {
    assert.deepEqual(
      hire.process.steps.map(step => step.title),
      ['Call', 'Scope', 'Build', 'Handover']
    );
    assert.match(hire.process.steps[0].body, /free 20-minute call/);
    assert.equal('overlapTodo' in hire.process, false);
    assert.doesNotMatch(
      read('src/components/sections/HireSection.tsx'),
      /overlapTodo|overlap with your team/i
    );
  });

  it('shows the four public projects and leaves the graphics platform out', () => {
    assert.deepEqual(hire.work.slugs, [
      'kaluwala',
      'explorewithnurse',
      'akira',
      'artbyshul',
    ]);
    const known = new Set(projects.items.map(item => item.slug));
    for (const slug of hire.work.slugs) {
      assert.equal(known.has(slug), true, slug);
    }
    assert.equal(hire.work.slugs.includes('creazilla'), false);
    assert.doesNotMatch(hireText, /creazilla|10M\+/i);
  });

  it('books through the contact page until cal.com exists, with Telegram second', () => {
    assert.equal(hire.booking.prompt, 'Have a project in mind?');
    assert.equal(hire.booking.label, 'Book a free 20-minute call');
    assert.equal(hire.booking.href, '/contact');
    assert.equal(hire.booking.cal, 'TODO: cal.com link');
    assert.equal(hire.booking.telegramHref, 'https://t.me/rootz491');
    assert.doesNotMatch(read('src/components/sections/HireSection.tsx'), /<form/i);
  });

  it('answers the FAQ, including payment methods', () => {
    assert.deepEqual(
      hire.faq.items.map(item => item.question),
      [
        'Are you available now?',
        'How do you charge?',
        'Do you work with agencies?',
        'Who owns the code?',
        'How do we stay in touch?',
        'How do I pay?',
      ]
    );
    assert.match(hire.faq.items[1].answer, /€20\/hour/);
    assert.match(hire.faq.items[2].answer, /white-label/);
    assert.equal(
      hire.faq.items.at(-1).answer,
      'Bank transfer, crypto, Wise, PayPal, or any other platform you prefer.'
    );
  });

  it('stays at region level and does not name employers', () => {
    const copy = collectStrings(hire).join('\n');
    assert.doesNotMatch(
      copy,
      /\b(street|road|lane|nagar|pincode|pin code|zip|mountain|trek|himalaya)\b/i
    );
    assert.doesNotMatch(copy, /\b(phone|gstin|ifsc|iban|swift|dob)\b/i);
    assert.doesNotMatch(copy, /date of birth/i);
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
    ];
    for (const name of banned) {
      assert.equal(
        hireText.toLowerCase().includes(name.toLowerCase()),
        false,
        name
      );
    }
    assert.doesNotMatch(hireText, /\bcursor\b/i);
  });

  it('links hire from the homepage hero', () => {
    const cta = json('content/profile.json').hero.ctas.find(
      item => item.href === '/hire'
    );
    assert.equal(cta.label, 'Hire me');
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
