import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const config = require('../next.config.js');

const sourceFiles = dir => {
  const entries = readdirSync(path.join(root, dir), { withFileTypes: true });
  return entries.flatMap(entry => {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(rel);
    return /\.(tsx?|jsx?)$/.test(entry.name) ? [rel] : [];
  });
};

describe('legacy redirects', () => {
  it('declares the exact redirect table as temporary (307) rules', async () => {
    assert.deepEqual(await config.redirects(), [
      { source: '/work', destination: '/projects', permanent: false },
      {
        source: '/work/:path*',
        destination: '/projects/:path*',
        permanent: false,
      },
      { source: '/services', destination: '/projects', permanent: false },
      {
        source: '/services/:path*',
        destination: '/projects',
        permanent: false,
      },
      { source: '/government', destination: '/about', permanent: false },
    ]);
  });

  it('does not declare any permanent redirect', async () => {
    for (const rule of await config.redirects()) {
      assert.equal(rule.permanent, false);
    }
  });
});

describe('security headers', () => {
  it('applies the exact header set to every path', async () => {
    assert.deepEqual(await config.headers(), [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains',
          },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ]);
  });

  it('drops deprecated and no-op headers', async () => {
    const keys = (await config.headers())[0].headers.map(header => header.key);
    assert.ok(!keys.includes('X-XSS-Protection'));
    assert.ok(!keys.includes('X-DNS-Prefetch-Control'));
  });

  it('does not ship a Content-Security-Policy yet', async () => {
    const keys = (await config.headers())[0].headers.map(header => header.key);
    assert.ok(!keys.includes('Content-Security-Policy'));
  });

  it('can deny framing because no page is embedded on purpose', () => {
    for (const file of sourceFiles('src')) {
      const contents = readFileSync(path.join(root, file), 'utf8');
      assert.doesNotMatch(contents, /<iframe/i, file);
    }
  });
});

describe('dead middleware', () => {
  it('no longer ships a root middleware.js/ts', () => {
    assert.equal(existsSync(path.join(root, 'middleware.ts')), false);
    assert.equal(existsSync(path.join(root, 'middleware.js')), false);
  });

  it('no longer ships a src middleware.js/ts', () => {
    assert.equal(existsSync(path.join(root, 'src/middleware.ts')), false);
    assert.equal(existsSync(path.join(root, 'src/middleware.js')), false);
  });
});
