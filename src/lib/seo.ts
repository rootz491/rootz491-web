import { getContact, getSite } from '@/lib/content';
import type { Metadata } from 'next';

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  /** Override the default OG / Twitter card image with a page-specific one. */
  ogImage?: string;
}

export function generateMetadata({
  title,
  description,
  path = '',
  ogImage,
}: SEOProps = {}): Metadata {
  const site = getSite();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || site.seo.url;

  /**
   * When a title is provided (child pages), return it as a plain string so
   * the root layout's title.template ("%s — Karan Sharma") appends the site
   * name automatically. When called with no title (root layout), return a
   * template object that sets both the default and the template.
   */
  const metaTitle: Metadata['title'] = title
    ? title
    : { default: site.seo.defaultTitle, template: `%s — ${site.brand.name}` };

  // Build the explicit OG/Twitter title (always include the site name suffix).
  const ogTitle = title ? `${title} — ${site.brand.name}` : site.seo.defaultTitle;

  const metaDescription = description || site.seo.defaultDescription;
  const url = `${baseUrl}${path}`;
  const resolvedOgImage = ogImage || site.seo.ogImage;

  return {
    metadataBase: new URL(baseUrl),
    title: metaTitle,
    description: metaDescription,
    keywords: site.seo.keywords,
    authors: [{ name: site.brand.name }],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'website',
      url,
      title: ogTitle,
      description: metaDescription,
      siteName: site.brand.name,
      images: [{ url: resolvedOgImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      site: site.seo.twitter,
      creator: site.seo.twitter,
      title: ogTitle,
      description: metaDescription,
      images: [resolvedOgImage],
    },
    icons: {
      icon: site.brand.favicon,
      shortcut: site.brand.favicon,
      apple: site.brand.favicon,
    },
  };
}

export function getPersonSchema() {
  const site = getSite();
  const contact = getContact();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || site.seo.url;

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.brand.name,
    alternateName: site.brand.alias,
    url: baseUrl,
    email: contact.email,
    sameAs: contact.social.map(s => s.url).filter(Boolean),
    jobTitle: site.brand.tagline,
  };
}

export function getWebSiteSchema() {
  const site = getSite();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || site.seo.url;

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.brand.name,
    alternateName: site.brand.wordmark,
    url: baseUrl,
    description: site.seo.defaultDescription,
  };
}
