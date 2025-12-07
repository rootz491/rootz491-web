import { Metadata } from 'next';
import { getSiteConfig } from './content';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  path?: string;
  noIndex?: boolean;
}

/**
 * Generate metadata for pages
 */
export function generateMetadata({
  title,
  description,
  keywords,
  ogImage,
  path = '',
  noIndex = false,
}: SEOProps = {}): Metadata {
  const siteConfig = getSiteConfig();
  const seo = siteConfig.seo;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rootz491.com';

  const metaTitle = title || seo.defaultTitle;
  const metaDescription = description || seo.defaultDescription;
  const metaKeywords = keywords || seo.keywords;
  const metaImage = ogImage || seo.ogImage;
  const url = `${baseUrl}${path}`;

  return {
    metadataBase: new URL(baseUrl),
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    authors: [{ name: siteConfig.brand.name }],
    creator: siteConfig.brand.name,
    publisher: siteConfig.brand.name,
    robots: noIndex ? 'noindex,nofollow' : 'index,follow',
    openGraph: {
      type: 'website',
      locale: 'en_IN',
      url,
      title: metaTitle,
      description: metaDescription,
      siteName: siteConfig.brand.name,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: seo.twitter,
      creator: seo.twitter,
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
    },
    alternates: {
      canonical: url,
    },
    icons: {
      icon: siteConfig.brand.favicon,
      shortcut: siteConfig.brand.favicon,
      apple: siteConfig.brand.favicon,
    },
  };
}

/**
 * Generate JSON-LD structured data for organization
 */
export function getOrganizationSchema() {
  const siteConfig = getSiteConfig();
  const contact = siteConfig.contact;
  const legal = siteConfig.legal;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rootz491.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.brand.name,
    url: baseUrl,
    logo: `${baseUrl}${siteConfig.brand.logo.src}`,
    description: siteConfig.seo.defaultDescription,
    email: contact.email,
    telephone: contact.phone,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
      addressLocality: contact.address,
    },
    sameAs: siteConfig.social.map(s => s.url).filter(Boolean),
    legalName: legal.companyName,
  };
}

/**
 * Generate JSON-LD structured data for breadcrumbs
 */
export function getBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rootz491.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  };
}

/**
 * Generate JSON-LD structured data for service
 */
export function getServiceSchema(service: {
  name: string;
  description: string;
  url: string;
}) {
  const siteConfig = getSiteConfig();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rootz491.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    url: `${baseUrl}${service.url}`,
    provider: {
      '@type': 'Organization',
      name: siteConfig.brand.name,
    },
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
  };
}

/**
 * Generate JSON-LD structured data for case study/work
 */
export function getCaseStudySchema(caseStudy: {
  name: string;
  description: string;
  image?: string;
  datePublished?: string;
}) {
  const siteConfig = getSiteConfig();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rootz491.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: caseStudy.name,
    description: caseStudy.description,
    image: caseStudy.image ? `${baseUrl}${caseStudy.image}` : undefined,
    datePublished: caseStudy.datePublished,
    author: {
      '@type': 'Organization',
      name: siteConfig.brand.name,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.brand.name,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}${siteConfig.brand.logo.src}`,
      },
    },
  };
}
