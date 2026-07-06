import { getContact, getSite } from '@/lib/content';
import { Metadata } from 'next';

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
}

export function generateMetadata({
  title,
  description,
  path = '',
}: SEOProps = {}): Metadata {
  const site = getSite();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || site.seo.url;

  const metaTitle = title ? `${title} — ${site.brand.name}` : site.seo.defaultTitle;
  const metaDescription = description || site.seo.defaultDescription;
  const url = `${baseUrl}${path}`;

  return {
    metadataBase: new URL(baseUrl),
    title: metaTitle,
    description: metaDescription,
    keywords: site.seo.keywords,
    authors: [{ name: site.brand.name }],
    openGraph: {
      type: 'website',
      url,
      title: metaTitle,
      description: metaDescription,
      siteName: site.brand.name,
      images: [{ url: site.seo.ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      site: site.seo.twitter,
      creator: site.seo.twitter,
      title: metaTitle,
      description: metaDescription,
      images: [site.seo.ogImage],
    },
    icons: { icon: site.brand.favicon },
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
