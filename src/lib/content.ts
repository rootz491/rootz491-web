import siteData from '../../site.json';
import { SiteDataSchema, type SiteData } from './types';

let cachedSiteData: SiteData | null = null;

/**
 * Load and validate site content from JSON file
 */
export function getSiteData(): SiteData {
  if (cachedSiteData) {
    return cachedSiteData;
  }

  try {
    // Validate against schema
    const validatedData = SiteDataSchema.parse(siteData);
    cachedSiteData = validatedData;

    return validatedData;
  } catch (error) {
    console.error('Error loading site data:', error);
    throw new Error(
      'Failed to load site configuration. Please check site.json'
    );
  }
}

/**
 * Get site configuration
 */
export function getSiteConfig() {
  const data = getSiteData();
  return data.site;
}

/**
 * Get page content by route
 */
export function getPageContent<T extends keyof SiteData['pages']>(
  route: T
): SiteData['pages'][T] {
  const data = getSiteData();
  return data.pages[route];
}

/**
 * Get shared content (FAQs, badges, footer note)
 */
export function getSharedContent() {
  const data = getSiteData();
  return data.shared;
}

/**
 * Get service by slug
 */
export function getServiceBySlug(slug: string) {
  const servicesPage = getPageContent('/services');
  const serviceDetail = getPageContent('/services/{slug}');

  // Find the service in the groups
  for (const group of servicesPage.groups) {
    const service = group.items.find(item => item.slug === slug);
    if (service) {
      return {
        ...serviceDetail,
        title: service.title,
        summary: service.summary,
        slug: service.slug,
      };
    }
  }

  return null;
}

/**
 * Get all service slugs for static generation
 */
export function getAllServiceSlugs(): string[] {
  const servicesPage = getPageContent('/services');
  const slugs: string[] = [];

  servicesPage.groups.forEach(group => {
    group.items.forEach(item => {
      slugs.push(item.slug);
    });
  });

  return slugs;
}

/**
 * Get work/case study by slug
 */
export function getWorkBySlug(slug: string) {
  const workPage = getPageContent('/work');
  const workDetail = getPageContent('/work/{slug}');

  const workItem = workPage.items.find(item => item.slug === slug);

  if (workItem) {
    return {
      ...workDetail,
      slug: workItem.slug,
    };
  }

  return null;
}

/**
 * Get all work/case study slugs for static generation
 */
export function getAllWorkSlugs(): string[] {
  const workPage = getPageContent('/work');
  return workPage.items.map(item => item.slug);
}

/**
 * Get navigation links
 */
export function getNavigation() {
  const siteConfig = getSiteConfig();
  return siteConfig.nav;
}

/**
 * Get contact information
 */
export function getContactInfo() {
  const siteConfig = getSiteConfig();
  return siteConfig.contact;
}

/**
 * Get social links
 */
export function getSocialLinks() {
  const siteConfig = getSiteConfig();
  return siteConfig.social;
}

/**
 * Get legal information
 */
export function getLegalInfo() {
  const siteConfig = getSiteConfig();
  return siteConfig.legal;
}
