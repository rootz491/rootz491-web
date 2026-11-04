import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import { cardHeadingFor } from '../src/lib/headings.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = rel => readFileSync(path.join(root, rel), 'utf8');

describe('card heading order', () => {
  const sections = [
    {
      name: 'project',
      page: 'src/app/projects/page.tsx',
      component: 'src/components/sections/ProjectsSection.tsx',
    },
    {
      name: 'blog',
      page: 'src/app/blog/page.tsx',
      component: 'src/components/sections/BlogsSection.tsx',
    },
  ];

  for (const section of sections) {
    it(`renders ${section.name} cards one level below the page h1`, () => {
      assert.match(read(section.page), /headingAs=['"]h1['"]/);
      const source = read(section.component);
      assert.match(source, /cardHeadingFor\(headingAs\)/);
      assert.match(source, /<CardHeading[\s>]/);
      assert.doesNotMatch(source, /<h3[\s>]/, 'no hard-coded h3 that can skip h2');
    });
  }

  it('keeps home cards at h3 under the section h2', () => {
    const home = read('src/app/page.tsx');
    assert.doesNotMatch(home, /headingAs/);
    assert.equal(cardHeadingFor('h2'), 'h3');
  });

  it('never skips a heading level', () => {
    assert.equal(cardHeadingFor('h1'), 'h2');
    assert.equal(cardHeadingFor('h2'), 'h3');
  });
});

describe('404 metadata', () => {
  const source = read('src/app/not-found.tsx');

  it('opts out of the canonical inherited from the root layout', () => {
    assert.match(source, /alternates:\s*{\s*canonical:\s*null\s*}/);
  });

  it('is noindex, nofollow', () => {
    assert.match(source, /robots:\s*{/);
    assert.match(source, /index:\s*false/);
    assert.match(source, /follow:\s*false/);
  });

  it('still declares a canonical for real pages', () => {
    assert.match(read('src/lib/seo.ts'), /alternates:\s*{\s*canonical:\s*url/);
  });
});

// WCAG 2.2 relative luminance / contrast ratio over sRGB.
const css = read('src/app/globals.css');

function hslVar(name) {
  const match = css.match(
    new RegExp(`--${name}:\\s*([\\d.]+)\\s+([\\d.]+)%\\s+([\\d.]+)%`)
  );
  assert.ok(match, `missing --${name} in globals.css`);
  return match.slice(1).map(Number);
}

function hslToRgb([h, s, l]) {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const [r, g, b] =
    h < 60
      ? [c, x, 0]
      : h < 120
        ? [x, c, 0]
        : h < 180
          ? [0, c, x]
          : h < 240
            ? [0, x, c]
            : h < 300
              ? [x, 0, c]
              : [c, 0, x];
  return [r, g, b].map(value => Math.round((value + m) * 255));
}

const linear = channel => {
  const value = channel / 255;
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
};

const luminance = ([r, g, b]) =>
  0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);

function contrast(foreground, background) {
  const [light, dark] = [luminance(foreground), luminance(background)].sort(
    (a, b) => b - a
  );
  return (light + 0.05) / (dark + 0.05);
}

function blend(foreground, background, alpha) {
  return foreground.map((channel, i) =>
    Math.round(channel * alpha + background[i] * (1 - alpha))
  );
}

// WCAG 2.5.8 Target Size (Minimum): standalone links need a 24x24 CSS px target.
// `min-h-6` is 1.5rem = 24px; inline-flex/items-center keeps the box uncluttered.
const minTapHeight = /\bmin-h-6\b/;

describe('standalone link tap targets', () => {
  it('gives SectionLink a 24px minimum height', () => {
    const source = read('src/components/ui/primitives.tsx');
    const sectionLink = source.slice(source.indexOf('export function SectionLink'));

    assert.ok(sectionLink, 'SectionLink component not found');
    assert.match(sectionLink, /inline-flex/);
    assert.match(sectionLink, /items-center/);
    assert.match(sectionLink, minTapHeight);
  });

  it('gives the /about company link a 24px minimum height', () => {
    const source = read('src/components/sections/ExperienceSection.tsx');
    const companyLink = source.match(/<Link[\s\S]*?\{item\.company\}[\s\S]*?<\/Link>/);

    assert.ok(companyLink, 'company link not found in ExperienceSection');
    assert.match(companyLink[0], /inline-flex/);
    assert.match(companyLink[0], /items-center/);
    assert.match(companyLink[0], minTapHeight);
  });

  it('keeps inline links inside paragraphs on their natural line-height', () => {
    const blogs = read('src/components/sections/BlogsSection.tsx');
    const inlineLink = blogs.match(/Posts coming soon[\s\S]*?<\/p>/);

    assert.ok(inlineLink, 'inline fallback link not found');
    assert.doesNotMatch(inlineLink[0], /min-h-|inline-flex/);

    const about = read('src/components/sections/AboutSection.tsx');
    assert.match(about, /leading-relaxed/);
  });
});

describe('/tools card text contrast', () => {
  const surface = hslToRgb(hslVar('surface'));
  const creamMuted = hslToRgb(hslVar('cream-muted'));

  it('uses a muted token that reaches 4.5:1 on the card surface', () => {
    assert.ok(
      contrast(creamMuted, surface) >= 4.5,
      `cream-muted on surface is ${contrast(creamMuted, surface).toFixed(2)}:1`
    );
  });

  it('keeps every muted text class in the card at 4.5:1', () => {
    const classes = new Set();
    for (const file of [
      'src/components/tools/ToolCard.tsx',
      'src/components/tools/ToolRow.tsx',
    ]) {
      for (const match of read(file).matchAll(/text-cream-muted(?:\/(\d{1,3}))?/g)) {
        classes.add(match[1] ? Number(match[1]) / 100 : 1);
      }
    }

    assert.ok(classes.size > 0, 'expected muted card text classes');
    for (const alpha of classes) {
      const foreground = alpha === 1 ? creamMuted : blend(creamMuted, surface, alpha);
      const ratio = contrast(foreground, surface);
      assert.ok(ratio >= 4.5, `text-cream-muted/${alpha * 100} is ${ratio.toFixed(2)}:1`);
    }
  });
});
