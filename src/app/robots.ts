import { getSite } from '@/lib/content';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const site = getSite();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || site.seo.url;

  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
