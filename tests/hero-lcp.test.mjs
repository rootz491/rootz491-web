import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = rel => readFileSync(path.join(root, rel), 'utf8');

describe('hero first paint', () => {
  const hero = read('src/components/sections/HeroSection.tsx');

  it('renders hero copy as static text instead of a hidden entrance state', () => {
    assert.doesNotMatch(hero, /initial=\{\{[^}]*opacity/, 'hero elements must not start at opacity 0');
    assert.doesNotMatch(hero, /FadeIn/, 'FadeIn wraps content in opacity: 0');
    assert.match(hero, /<h1 className='text-\[40px\] font-black leading-tight text-cream md:text-\[56px\]'>/);
    assert.match(hero, /<p className='text-\[28px\] font-medium leading-\[38px\] text-cream\/90'>/);
  });

  it('keeps the remaining entrance motion transform-only on non-LCP elements', () => {
    assert.doesNotMatch(hero, /initial=\{\{[^}]*opacity/);
    assert.match(hero, /initial=\{\{ y: 16 \}\}/);
    assert.match(hero, /initial=\{\{ scale: 0\.96 \}\}/);
  });

  it('respects prefers-reduced-motion through MotionConfig and CSS', () => {
    assert.match(read('src/components/motion/SmoothScroll.tsx'), /reducedMotion='user'/);
    assert.match(read('src/app/globals.css'), /prefers-reduced-motion: reduce/);
  });
});

describe('image space reservation', () => {
  it('reserves the hero avatar box and uses framework responsive sizing', () => {
    const hero = read('src/components/sections/HeroSection.tsx');
    assert.match(hero, /h-48 w-48[^']*md:h-56 md:w-56/);
    assert.match(hero, /fill/);
    assert.match(hero, /sizes='\(max-width: 768px\) 192px, 224px'/);
  });

  it('reserves every project thumbnail with a fixed aspect-ratio wrapper', () => {
    const projects = read('src/components/sections/ProjectsSection.tsx');
    assert.match(projects, /relative aspect-\[16\/10\] overflow-hidden/);
    assert.match(projects, /fill/);
    assert.match(projects, /sizes='\(max-width: 768px\) 100vw, \(max-width: 1024px\) 50vw, 33vw'/);
  });

  it('reserves the project detail image with a fixed aspect-ratio wrapper', () => {
    const detail = read('src/app/projects/[slug]/page.tsx');
    assert.match(detail, /relative aspect-video overflow-hidden/);
    assert.match(detail, /fill/);
  });
});

describe('font loading', () => {
  it('uses the variable Inter font with display swap and preloading', () => {
    const layout = read('src/app/layout.tsx');
    assert.match(layout, /display: 'swap'/);
    assert.doesNotMatch(layout, /preload:\s*false/);
    assert.equal(layout.match(/Inter\(/g)?.length, 1);
  });
});
