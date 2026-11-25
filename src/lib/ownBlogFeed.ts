export type OwnBlogPost = {
  title: string;
  url: string;
};

export const OWN_BLOG_ID = 'rootz';
export const OWN_BLOG_URL = 'https://blog.rootz491.com';
export const OWN_BLOG_FALLBACK_LABEL = 'Read on blog.rootz491.com';
export const OWN_BLOG_POST_LIMIT = 5;
export const OWN_BLOG_REVALIDATE_SECONDS = 60 * 60;

/** RSS first, then the JSON Feed and the usual alternate paths. */
export const OWN_BLOG_FEED_URLS = [
  'https://blog.rootz491.com/rss.xml',
  'https://blog.rootz491.com/feed.json',
  'https://blog.rootz491.com/feed',
  'https://blog.rootz491.com/atom.xml',
] as const;

export type FeedResponseLike = {
  ok: boolean;
  body: string;
  contentType?: string | null;
};

type DatedPost = OwnBlogPost & {
  time: number | null;
  index: number;
};

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

function fromCodePoint(code: number): string {
  if (!Number.isInteger(code) || code < 0 || code > 0x10ffff) return '';
  return String.fromCodePoint(code);
}

function decodeEntities(value: string): string {
  const decoded = value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) =>
      fromCodePoint(Number.parseInt(hex, 16))
    )
    .replace(/&#(\d+);/g, (_, dec: string) =>
      fromCodePoint(Number.parseInt(dec, 10))
    );

  let named = decoded;
  for (let pass = 0; pass < 2; pass += 1) {
    named = named.replace(/&([a-z]+);/gi, (entity, name: string) => {
      return NAMED_ENTITIES[name.toLowerCase()] ?? entity;
    });
  }
  return named;
}

function normalizePostUrl(raw: string): string | null {
  const trimmed = decodeEntities(raw).trim();
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed, OWN_BLOG_URL);
    if (url.protocol !== 'https:') return null;
    if (url.username || url.password) return null;
    return url.href;
  } catch {
    return null;
  }
}

function cleanTitle(value: string): string {
  return decodeEntities(value)
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function blocks(xml: string, tag: string): string[] {
  const pattern = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi');
  return [...xml.matchAll(pattern)].map(match => match[1] ?? '');
}

function textContent(block: string, tag: string): string {
  const pattern = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = block.match(pattern);
  if (!match) return '';
  const raw = (match[1] ?? '').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');
  return cleanTitle(raw);
}

function linkFromBlock(block: string): string {
  const stripped = block
    .replace(/<content:encoded\b[^>]*>[\s\S]*?<\/content:encoded>/gi, '')
    .replace(/<description\b[^>]*>[\s\S]*?<\/description>/gi, '')
    .replace(/<(?:atom:)?summary\b[^>]*>[\s\S]*?<\/(?:atom:)?summary>/gi, '')
    .replace(/<(?:atom:)?content\b[^>]*>[\s\S]*?<\/(?:atom:)?content>/gi, '');

  const textLink = stripped.match(
    /<(?:atom:)?link\b[^>]*>([^<]+)<\/(?:atom:)?link>/i
  );
  if (textLink?.[1]?.trim()) return textLink[1];

  const parsed = [...stripped.matchAll(/<(?:atom:)?link\b([^>]*)\/?>/gi)]
    .map(match => {
      const attrs = match[1] ?? '';
      const href = attrs.match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1] ?? '';
      const rel = (
        attrs.match(/\brel\s*=\s*["']([^"']+)["']/i)?.[1] ?? 'alternate'
      ).toLowerCase();
      return { href, rel };
    })
    .filter(link => link.href.trim());

  const alternate = parsed.find(link =>
    link.rel.split(/\s+/).includes('alternate')
  );
  if (alternate) return alternate.href;

  const notSelf = parsed.find(link => !link.rel.split(/\s+/).includes('self'));
  return (notSelf ?? parsed[0])?.href ?? '';
}

function publishedTime(block: string): number | null {
  const raw =
    textContent(block, 'pubDate') ||
    textContent(block, 'published') ||
    textContent(block, 'updated') ||
    textContent(block, 'dc:date');
  const time = Date.parse(raw);
  return Number.isNaN(time) ? null : time;
}

function sortAndDedupe(items: DatedPost[]): OwnBlogPost[] {
  const anyDate = items.some(item => item.time !== null);
  const ordered = anyDate
    ? [...items].sort((a, b) => {
        const at = a.time ?? Number.NEGATIVE_INFINITY;
        const bt = b.time ?? Number.NEGATIVE_INFINITY;
        if (bt !== at) return bt - at;
        return a.index - b.index;
      })
    : items;

  const seen = new Set<string>();
  const posts: OwnBlogPost[] = [];
  for (const item of ordered) {
    if (seen.has(item.url)) continue;
    seen.add(item.url);
    posts.push({ title: item.title, url: item.url });
  }
  return posts;
}

function parseXmlFeed(xml: string): OwnBlogPost[] {
  const itemBlocks = blocks(xml, 'item');
  const source = itemBlocks.length > 0 ? itemBlocks : blocks(xml, 'entry');

  const dated: DatedPost[] = [];
  source.forEach((block, index) => {
    const title = textContent(block, 'title');
    const url = normalizePostUrl(linkFromBlock(block));
    if (!title || !url) return;
    dated.push({ title, url, time: publishedTime(block), index });
  });
  return sortAndDedupe(dated);
}

function parseJsonFeed(body: string): OwnBlogPost[] {
  let data: unknown;
  try {
    data = JSON.parse(body);
  } catch {
    return [];
  }
  if (!data || typeof data !== 'object') return [];

  const items = (data as { items?: unknown }).items;
  if (!Array.isArray(items)) return [];

  const dated: DatedPost[] = [];
  items.forEach((item, index) => {
    if (!item || typeof item !== 'object') return;
    const record = item as Record<string, unknown>;
    const title =
      typeof record.title === 'string' ? cleanTitle(record.title) : '';
    const rawUrl =
      typeof record.url === 'string'
        ? record.url
        : typeof record.external_url === 'string'
          ? record.external_url
          : typeof record.id === 'string'
            ? record.id
            : '';
    const url = normalizePostUrl(rawUrl);
    if (!title || !url) return;

    const dateRaw =
      typeof record.date_published === 'string'
        ? record.date_published
        : typeof record.date_modified === 'string'
          ? record.date_modified
          : '';
    const time = Date.parse(dateRaw);
    dated.push({
      title,
      url,
      time: Number.isNaN(time) ? null : time,
      index,
    });
  });
  return sortAndDedupe(dated);
}

export function parseFeed(
  body: string,
  contentType?: string | null
): OwnBlogPost[] {
  const trimmed = body.replace(/^\uFEFF/, '').trim();
  if (!trimmed) return [];
  if (/^<!doctype\s+html/i.test(trimmed) || /^<html[\s>]/i.test(trimmed)) {
    return [];
  }

  const type = (contentType ?? '').toLowerCase();
  const looksJson = trimmed.startsWith('{') || trimmed.startsWith('[');
  const looksXml = trimmed.startsWith('<');

  if (type.includes('html') && !looksJson && !looksXml) return [];
  if (looksJson || (type.includes('json') && !looksXml)) {
    return parseJsonFeed(trimmed);
  }
  if (
    looksXml ||
    type.includes('xml') ||
    type.includes('rss') ||
    type.includes('atom')
  ) {
    return parseXmlFeed(trimmed);
  }
  return [];
}

/** First usable feed wins. An empty or failed body falls through. */
export function postsFromFeedResponses(
  responses: readonly FeedResponseLike[],
  limit = OWN_BLOG_POST_LIMIT
): OwnBlogPost[] {
  for (const response of responses) {
    if (!response.ok) continue;
    const posts = parseFeed(response.body, response.contentType).slice(
      0,
      limit
    );
    if (posts.length > 0) return posts;
  }
  return [];
}

export function mergeOwnBlogPosts<
  T extends { id: string; posts: OwnBlogPost[] },
>(platforms: readonly T[], posts: readonly OwnBlogPost[]): T[] {
  if (posts.length === 0) return [...platforms];
  return platforms.map(platform =>
    platform.id === OWN_BLOG_ID ? { ...platform, posts: [...posts] } : platform
  );
}

export function ownBlogNeedsFallback(platform: {
  id: string;
  posts: readonly unknown[];
}): boolean {
  return platform.id === OWN_BLOG_ID && platform.posts.length === 0;
}

export function platformsForView<T extends { id: string }>(
  platforms: readonly T[],
  preview: boolean
): T[] {
  if (!preview) return [...platforms];
  return platforms.slice(0, 2);
}
