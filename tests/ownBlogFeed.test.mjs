import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  OWN_BLOG_FALLBACK_LABEL,
  OWN_BLOG_FEED_URLS,
  OWN_BLOG_ID,
  OWN_BLOG_POST_LIMIT,
  OWN_BLOG_REVALIDATE_SECONDS,
  mergeOwnBlogPosts,
  ownBlogNeedsFallback,
  parseFeed,
  platformsForView,
  postsFromFeedResponses,
} from '../src/lib/ownBlogFeed.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = rel => readFileSync(path.join(root, rel), 'utf8');

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>rootz491 blog</title>
    <link>https://blog.rootz491.com/</link>
    <item>
      <title>Older post</title>
      <link>https://blog.rootz491.com/posts/older/</link>
      <pubDate>Thu, 22 Oct 2026 02:00:00 GMT</pubDate>
      <description>A decoy &lt;link&gt;https://evil.example/phish&lt;/link&gt;</description>
      <content:encoded><![CDATA[<p>Read <a href="https://evil.example/more">more</a></p>]]></content:encoded>
    </item>
    <item>
      <title><![CDATA[A month of letting my AI assistant run a $0.13-a-PR coding agent]]></title>
      <link>https://blog.rootz491.com/posts/ai-assistant/</link>
      <pubDate>Fri, 20 Nov 2026 12:55:38 GMT</pubDate>
    </item>
    <item>
      <title>It&#39;s a &amp;amp; test</title>
      <link>/posts/entities/</link>
      <pubDate>Wed, 01 Nov 2026 00:00:00 GMT</pubDate>
    </item>
    <item>
      <title>Duplicate</title>
      <link>https://blog.rootz491.com/posts/ai-assistant/</link>
      <guid>https://blog.rootz491.com/posts/ai-assistant/</guid>
      <pubDate>Fri, 20 Nov 2026 12:55:38 GMT</pubDate>
    </item>
    <item>
      <title>Drop insecure</title>
      <link>http://blog.rootz491.com/posts/plain/</link>
      <pubDate>Sat, 21 Nov 2026 00:00:00 GMT</pubDate>
    </item>
    <item>
      <title>Drop script</title>
      <link>javascript:alert(1)</link>
      <pubDate>Sun, 22 Nov 2026 00:00:00 GMT</pubDate>
    </item>
    <item>
      <title>   </title>
      <link>https://blog.rootz491.com/posts/blank/</link>
    </item>
    <item>
      <title>Fourth</title>
      <link>https://blog.rootz491.com/posts/fourth/</link>
      <pubDate>Mon, 02 Nov 2026 00:00:00 GMT</pubDate>
    </item>
    <item>
      <title>Fifth</title>
      <link>https://blog.rootz491.com/posts/fifth/</link>
      <pubDate>Tue, 03 Nov 2026 00:00:00 GMT</pubDate>
    </item>
    <item>
      <title>Sixth</title>
      <link>https://blog.rootz491.com/posts/sixth/</link>
      <pubDate>Wed, 04 Nov 2026 00:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`;

const atom = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>rootz491 blog</title>
  <link rel="self" href="https://blog.rootz491.com/atom.xml"/>
  <entry>
    <title>Older atom</title>
    <link rel="self" href="https://blog.rootz491.com/posts/older-atom/"/>
    <link rel="alternate" type="text/html" href="https://blog.rootz491.com/posts/older-atom/"/>
    <updated>2026-10-22T02:00:00Z</updated>
  </entry>
  <entry>
    <title type="html">Newer &amp; atom</title>
    <link href="https://blog.rootz491.com/posts/newer-atom/"/>
    <published>2026-11-20T12:55:38Z</published>
  </entry>
</feed>`;

describe('own blog feed parsing', () => {
  it('prefers the RSS feed, then the JSON feed and alternate paths', () => {
    assert.deepEqual(OWN_BLOG_FEED_URLS, [
      'https://blog.rootz491.com/rss.xml',
      'https://blog.rootz491.com/feed.json',
      'https://blog.rootz491.com/feed',
      'https://blog.rootz491.com/atom.xml',
    ]);
  });

  it('parses RSS items newest-first and ignores body links', () => {
    const posts = parseFeed(rss, 'application/rss+xml; charset=utf-8');
    assert.deepEqual(
      posts.map(post => post.title),
      [
        'A month of letting my AI assistant run a $0.13-a-PR coding agent',
        'Sixth',
        'Fifth',
        'Fourth',
        "It's a & test",
        'Older post',
      ]
    );
    assert.equal(posts[0].url, 'https://blog.rootz491.com/posts/ai-assistant/');
    assert.equal(posts.at(-1)?.url, 'https://blog.rootz491.com/posts/older/');
    assert.equal(
      posts.find(post => post.title === "It's a & test")?.url,
      'https://blog.rootz491.com/posts/entities/'
    );
    assert.ok(posts.every(post => post.url.startsWith('https://')));
    assert.equal(new Set(posts.map(post => post.url)).size, posts.length);
  });

  it('parses Atom entries and skips the self link', () => {
    assert.deepEqual(parseFeed(atom, 'application/atom+xml'), [
      {
        title: 'Newer & atom',
        url: 'https://blog.rootz491.com/posts/newer-atom/',
      },
      {
        title: 'Older atom',
        url: 'https://blog.rootz491.com/posts/older-atom/',
      },
    ]);
  });

  it('parses a JSON Feed when that is what the server returned', () => {
    const body = JSON.stringify({
      version: 'https://jsonfeed.org/version/1.1',
      items: [
        {
          id: 'https://blog.rootz491.com/posts/old/',
          url: 'https://blog.rootz491.com/posts/old/',
          title: 'Old',
          date_published: '2026-10-01T00:00:00.000Z',
        },
        {
          title: 'New',
          url: 'https://blog.rootz491.com/posts/new/',
          date_published: '2026-11-20T12:55:38.000Z',
        },
        { title: 'No url', id: 'tag:blog.rootz491.com,2026:missing' },
      ],
    });

    assert.deepEqual(parseFeed(body, 'application/feed+json'), [
      { title: 'New', url: 'https://blog.rootz491.com/posts/new/' },
      { title: 'Old', url: 'https://blog.rootz491.com/posts/old/' },
    ]);
  });

  it('keeps document order when the feed has no dates', () => {
    const undated = `<rss version="2.0"><channel>
      <item><title>First</title><link>https://blog.rootz491.com/posts/first/</link></item>
      <item><title>Second</title><link>https://blog.rootz491.com/posts/second/</link></item>
    </channel></rss>`;
    assert.deepEqual(
      parseFeed(undated).map(post => post.title),
      ['First', 'Second']
    );
  });
});

describe('own blog feed fallback', () => {
  const valid = {
    ok: true,
    contentType: 'application/rss+xml',
    body: `<rss version="2.0"><channel>
      <item><title>One</title><link>https://blog.rootz491.com/posts/one/</link><pubDate>Mon, 01 Jun 2026 00:00:00 GMT</pubDate></item>
      <item><title>Two</title><link>https://blog.rootz491.com/posts/two/</link><pubDate>Tue, 02 Jun 2026 00:00:00 GMT</pubDate></item>
      <item><title>Three</title><link>https://blog.rootz491.com/posts/three/</link><pubDate>Wed, 03 Jun 2026 00:00:00 GMT</pubDate></item>
      <item><title>Four</title><link>https://blog.rootz491.com/posts/four/</link><pubDate>Thu, 04 Jun 2026 00:00:00 GMT</pubDate></item>
      <item><title>Five</title><link>https://blog.rootz491.com/posts/five/</link><pubDate>Fri, 05 Jun 2026 00:00:00 GMT</pubDate></item>
      <item><title>Six</title><link>https://blog.rootz491.com/posts/six/</link><pubDate>Sat, 06 Jun 2026 00:00:00 GMT</pubDate></item>
    </channel></rss>`,
  };

  it('uses the first good feed and caps the card at five posts', () => {
    const posts = postsFromFeedResponses([
      { ok: false, contentType: 'text/html', body: valid.body },
      {
        ok: true,
        contentType: 'text/html',
        body: '<!DOCTYPE html><html><title>missing</title></html>',
      },
      {
        ok: true,
        contentType: 'application/rss+xml',
        body: '<rss version="2.0"><channel></channel></rss>',
      },
      valid,
    ]);

    assert.equal(posts.length, OWN_BLOG_POST_LIMIT);
    assert.deepEqual(
      posts.map(post => post.title),
      ['Six', 'Five', 'Four', 'Three', 'Two']
    );
  });

  it('returns no posts when every candidate fails', () => {
    assert.deepEqual(
      postsFromFeedResponses([
        { ok: false, body: valid.body, contentType: 'application/rss+xml' },
        { ok: true, body: 'not a feed', contentType: 'text/plain' },
        { ok: true, body: '{', contentType: 'application/feed+json' },
        { ok: true, body: '', contentType: 'application/rss+xml' },
      ]),
      []
    );
  });

  it('asks the card to link back to the blog when the feed produced nothing', () => {
    const platforms = [
      {
        id: OWN_BLOG_ID,
        name: 'Blog',
        posts: [],
      },
      {
        id: 'medium',
        name: 'Medium',
        posts: [{ title: 'IDOR', url: 'https://medium.com/idor' }],
      },
    ];

    assert.deepEqual(mergeOwnBlogPosts(platforms, []), platforms);
    assert.equal(ownBlogNeedsFallback(platforms[0]), true);
    assert.equal(ownBlogNeedsFallback(platforms[1]), false);
    assert.equal(OWN_BLOG_FALLBACK_LABEL, 'Read on blog.rootz491.com');
  });

  it('fills only the own-blog card and leaves the other platforms alone', () => {
    const medium = {
      id: 'medium',
      name: 'Medium',
      posts: [{ title: 'IDOR', url: 'https://medium.com/idor' }],
    };
    const devto = { id: 'devto', name: 'DEV Community', posts: [] };
    const hashnode = {
      id: 'hashnode',
      name: 'Hashnode',
      posts: [{ title: 'JWT', url: 'https://hashnode.example/jwt' }],
    };
    const rootz = {
      id: OWN_BLOG_ID,
      name: 'Blog',
      posts: [],
    };
    const fetched = [
      { title: 'From the feed', url: 'https://blog.rootz491.com/posts/feed/' },
    ];

    const merged = mergeOwnBlogPosts([rootz, medium, devto, hashnode], fetched);

    assert.equal(merged[0].id, OWN_BLOG_ID);
    assert.deepEqual(merged[0].posts, fetched);
    assert.deepEqual(merged[1], medium);
    assert.deepEqual(merged[2], devto);
    assert.deepEqual(merged[3], hashnode);
    assert.equal(ownBlogNeedsFallback(merged[0]), false);

    assert.deepEqual(
      platformsForView(merged, false).map(platform => platform.id),
      [OWN_BLOG_ID, 'medium', 'devto', 'hashnode']
    );
    assert.deepEqual(
      platformsForView(merged, true).map(platform => platform.id),
      [OWN_BLOG_ID, 'medium']
    );
  });

  it('keeps the feed fetch on the server so the CSP does not need the blog host', () => {
    const section = read('src/components/sections/BlogsSection.tsx');
    const server = read('src/lib/ownBlogFeed.server.ts');
    assert.doesNotMatch(section, /ownBlogFeed\.server/);
    assert.doesNotMatch(section, /\bfetch\s*\(/);
    assert.match(section, /OWN_BLOG_FALLBACK_LABEL/);
    assert.match(server, /revalidate:\s*OWN_BLOG_REVALIDATE_SECONDS/);
    assert.equal(OWN_BLOG_REVALIDATE_SECONDS, 3600);
    assert.match(read('src/app/blog/page.tsx'), /export const revalidate = 3600/);
    assert.match(read('src/app/page.tsx'), /export const revalidate = 3600/);
    assert.doesNotMatch(read('csp.js'), /blog\.rootz491\.com/);
  });
});
