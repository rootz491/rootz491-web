import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
process.env.NODE_ENV = 'production';
const config = require('../next.config.js');
const { buildContentSecurityPolicy } = require('../csp.js');

const productionCsp =
  "default-src 'self'; " +
  "script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com; " +
  "style-src 'self' 'unsafe-inline'; " +
  "img-src 'self' data: blob: https://images.unsplash.com; " +
  "font-src 'self' data:; " +
  "connect-src 'self' https://cloudflareinsights.com; " +
  "frame-src 'none'; frame-ancestors 'none'; object-src 'none'; " +
  "base-uri 'self'; form-action 'self'; manifest-src 'self'; " +
  "worker-src 'self' blob:; upgrade-insecure-requests";

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
          {
            key: 'Content-Security-Policy',
            value: productionCsp,
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

  it('ships the exact production Content-Security-Policy on every path', async () => {
    const rule = (await config.headers()).find(entry => entry.source === '/(.*)');
    assert.ok(rule, 'missing the catch-all header rule');
    const csp = rule.headers.find(header => header.key === 'Content-Security-Policy');
    assert.equal(
      csp?.value,
      productionCsp,
      'production CSP must match the documented directive list'
    );
    assert.doesNotMatch(csp.value, /'unsafe-eval'/);
    assert.match(csp.value, /frame-ancestors 'none'/);
    assert.match(csp.value, /object-src 'none'/);
  });

  it('relaxes only script-src and connect-src in development', () => {
    const devCsp = buildContentSecurityPolicy({ dev: true });
    assert.match(
      devCsp,
      /script-src 'self' 'unsafe-inline' 'unsafe-eval' https:\/\/static\.cloudflareinsights\.com/
    );
    assert.match(
      devCsp,
      /connect-src 'self' ws: https:\/\/cloudflareinsights\.com/
    );
    assert.doesNotMatch(productionCsp, /ws:/);
    assert.doesNotMatch(devCsp, /upgrade-insecure-requests/);
    assert.equal(
      devCsp.replace(" 'unsafe-eval'", '').replace(' ws:', '') +
        '; upgrade-insecure-requests',
      productionCsp
    );
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
