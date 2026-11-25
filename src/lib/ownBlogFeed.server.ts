import {
  OWN_BLOG_FEED_URLS,
  OWN_BLOG_REVALIDATE_SECONDS,
  postsFromFeedResponses,
  type OwnBlogPost,
} from './ownBlogFeed';

const FEED_ACCEPT =
  'application/rss+xml, application/atom+xml, application/feed+json, application/json, application/xml, text/xml;q=0.9';

/**
 * Latest posts from blog.rootz491.com.
 * Fetched on the server (build + ISR) so the browser CSP never needs the blog host.
 * Any failure returns [] and the Writing card shows the plain visit link.
 */
export async function getOwnBlogPosts(): Promise<OwnBlogPost[]> {
  for (const url of OWN_BLOG_FEED_URLS) {
    let response: Response;
    try {
      response = await fetch(url, {
        headers: { accept: FEED_ACCEPT },
        signal: AbortSignal.timeout(8000),
        next: { revalidate: OWN_BLOG_REVALIDATE_SECONDS },
      });
    } catch {
      continue;
    }

    let body = '';
    try {
      body = await response.text();
    } catch {
      continue;
    }

    const posts = postsFromFeedResponses([
      {
        ok: response.ok,
        body,
        contentType: response.headers.get('content-type'),
      },
    ]);
    if (posts.length > 0) return posts;
  }

  return [];
}
