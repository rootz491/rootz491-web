'use strict';

const PRODUCTION_DIRECTIVES = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.unsplash.com",
  "font-src 'self' data:",
  "connect-src 'self' https://cloudflareinsights.com",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "manifest-src 'self'",
  "worker-src 'self' blob:",
  'upgrade-insecure-requests',
];

function buildContentSecurityPolicy({ dev = false } = {}) {
  // next dev serves plain http://localhost, so upgrading would break it.
  const directives = dev
    ? PRODUCTION_DIRECTIVES.filter(d => d !== 'upgrade-insecure-requests')
    : PRODUCTION_DIRECTIVES;
  return directives.map(directive => {
    if (!dev) return directive;
    if (directive.startsWith('script-src ')) {
      return directive.replace(
        "script-src 'self' 'unsafe-inline'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
      );
    }
    if (directive.startsWith('connect-src ')) {
      return directive.replace("connect-src 'self'", "connect-src 'self' ws:");
    }
    return directive;
  }).join('; ');
}

module.exports = { buildContentSecurityPolicy };
