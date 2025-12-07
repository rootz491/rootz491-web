import { z } from 'zod';

// Brand schema
export const BrandSchema = z.object({
  name: z.string(),
  tagline: z.string(),
  logo: z.object({
    type: z.string(),
    src: z.string(),
    alt: z.string(),
  }),
  favicon: z.string(),
});

// Theme schema
export const ThemeSchema = z.object({
  mode: z.enum(['light', 'dark']),
  accent: z.string(),
});

// Contact schema
export const ContactSchema = z.object({
  email: z.string().email(),
  phone: z.string(),
  whatsapp: z.string().optional(),
  address: z.string(),
  hours: z.string(),
  mapEmbedUrl: z.string().optional(),
});

// Legal schema
export const LegalSchema = z.object({
  companyName: z.string(),
  pan: z.string(),
  gstin: z.string(),
  udyam: z.string(),
  iec: z.string(),
  privacyUrl: z.string(),
  termsUrl: z.string(),
  securityUrl: z.string(),
});

// Social schema
export const SocialSchema = z.object({
  platform: z.string(),
  url: z.string(),
});

// Navigation schemas
export const NavLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

export const NavSchema = z.object({
  primary: z.array(NavLinkSchema),
  cta: NavLinkSchema,
  footer: z.array(NavLinkSchema),
});

// SEO schema
export const SEOSchema = z.object({
  defaultTitle: z.string(),
  defaultDescription: z.string(),
  keywords: z.array(z.string()),
  ogImage: z.string(),
  twitter: z.string(),
});

// Site schema
export const SiteSchema = z.object({
  brand: BrandSchema,
  theme: ThemeSchema,
  contact: ContactSchema,
  legal: LegalSchema,
  social: z.array(SocialSchema),
  nav: NavSchema,
  seo: SEOSchema,
});

// Page component schemas
export const CTASchema = z.object({
  label: z.string(),
  href: z.string(),
});

export const StatSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export const MediaSchema = z.object({
  type: z.string(),
  src: z.string(),
  alt: z.string(),
});

export const HeroSchema = z.object({
  badges: z.array(z.string()),
  title: z.string(),
  subtitle: z.string(),
  primaryCta: CTASchema,
  secondaryCta: CTASchema,
  stats: z.array(StatSchema),
  media: MediaSchema,
});

export const ServiceHighlightItemSchema = z.object({
  icon: z.string(),
  title: z.string(),
  desc: z.string(),
  bullets: z.array(z.string()),
  href: z.string(),
});

export const ServiceHighlightsSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  items: z.array(ServiceHighlightItemSchema),
});

export const GovtCardSchema = z.object({
  title: z.string(),
  text: z.string(),
});

export const GovtFocusSchema = z.object({
  title: z.string(),
  paragraph: z.string(),
  cards: z.array(GovtCardSchema),
});

export const WorkPreviewItemSchema = z.object({
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  thumb: z.string(),
});

export const WorkPreviewSchema = z.object({
  title: z.string(),
  items: z.array(WorkPreviewItemSchema),
});

export const TestimonialSchema = z.object({
  name: z.string(),
  role: z.string(),
  quote: z.string(),
  logo: z.string(),
});

export const CTABannerSchema = z.object({
  title: z.string(),
  cta: CTASchema,
});

// Homepage schema
export const HomePageSchema = z.object({
  hero: HeroSchema,
  serviceHighlights: ServiceHighlightsSchema,
  govtFocus: GovtFocusSchema,
  workPreview: WorkPreviewSchema,
  testimonials: z.array(TestimonialSchema),
  ctaBanner: CTABannerSchema,
});

// Services page schemas
export const ServiceItemSchema = z.object({
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  bullets: z.array(z.string()),
  href: z.string(),
  problem: z.string().optional(),
  solution: z.array(z.string()).optional(),
  deliverables: z.array(z.string()).optional(),
  stack: z.array(z.string()).optional(),
});

export const ServiceGroupSchema = z.object({
  title: z.string(),
  items: z.array(ServiceItemSchema),
});

export const PlanSchema = z.object({
  slug: z.string(),
  name: z.string(),
  price: z.string(),
  features: z.array(z.string()),
});

export const ServicesPageSchema = z.object({
  title: z.string(),
  intro: z.string(),
  groups: z.array(ServiceGroupSchema),
  plans: z.array(PlanSchema),
});

// Service detail page schema
export const ServiceDetailSchema = z.object({
  seoTitle: z.string(),
  title: z.string(),
  summary: z.string(),
  heroImage: z.string(),
  problem: z.string(),
  solution: z.array(z.string()),
  deliverables: z.array(z.string()),
  stack: z.array(z.string()),
  caseStudies: z.array(z.string()),
  cta: CTASchema,
});

// Government page schema
export const GovernmentPageSchema = z.object({
  title: z.string(),
  badges: z.array(z.string()),
  procurement: z.object({
    platforms: z.array(z.string()),
    modes: z.array(z.string()),
  }),
  compliance: z.array(z.string()),
  security: z.array(z.string()),
  documents: z.array(
    z.object({
      label: z.string(),
      url: z.string(),
    })
  ),
  cta: CTASchema,
});

// Work page schemas
export const WorkItemSchema = z.object({
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  thumb: z.string(),
  href: z.string(),
});

export const WorkPageSchema = z.object({
  title: z.string(),
  intro: z.string(),
  items: z.array(WorkItemSchema),
});

// Work detail page schema
export const WorkDetailSchema = z.object({
  seoTitle: z.string(),
  title: z.string(),
  client: z.object({
    name: z.string(),
    sector: z.string(),
  }),
  liveUrl: z.string().optional(),
  cover: z.string(),
  summary: z.string(),
  kpis: z.array(StatSchema),
  challenge: z.string(),
  approach: z.array(z.string()),
  stack: z.array(z.string()),
  gallery: z.array(z.string()),
  testimonial: z
    .object({
      name: z.string(),
      role: z.string(),
      quote: z.string(),
    })
    .optional(),
});

// About page schema
export const TeamMemberSchema = z.object({
  name: z.string(),
  role: z.string(),
  avatar: z.string(),
  bio: z.string(),
});

export const BadgeItemSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export const AboutPageSchema = z.object({
  title: z.string(),
  lede: z.string(),
  highlights: z.array(z.string()),
  team: z.array(TeamMemberSchema),
  badges: z.array(BadgeItemSchema),
});

// Contact page schema
export const FormFieldSchema = z.object({
  name: z.string(),
  label: z.string(),
  type: z.string(),
  required: z.boolean(),
});

export const ContactPageSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  form: z.object({
    fields: z.array(FormFieldSchema),
    submit: z.object({
      label: z.string(),
    }),
    successMessage: z.string(),
  }),
  altContacts: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    })
  ),
});

// Blog page schema
export const BlogPostSchema = z.object({
  slug: z.string(),
  title: z.string(),
  excerpt: z.string(),
  date: z.string(),
  tags: z.array(z.string()),
  cover: z.string(),
});

export const BlogPageSchema = z.object({
  title: z.string(),
  intro: z.string(),
  posts: z.array(BlogPostSchema),
});

// Shared content schemas
export const FAQSchema = z.object({
  q: z.string(),
  a: z.string(),
});

export const SharedBadgeSchema = z.object({
  label: z.string(),
  icon: z.string(),
});

export const SharedSchema = z.object({
  faqs: z.array(FAQSchema),
  badges: z.array(SharedBadgeSchema),
  footerNote: z.string(),
});

// Main site data schema
export const SiteDataSchema = z.object({
  site: SiteSchema,
  pages: z
    .object({
      '/': HomePageSchema,
      '/services': ServicesPageSchema,
      '/services/{slug}': ServiceDetailSchema,
      '/government': GovernmentPageSchema,
      '/work': WorkPageSchema,
      '/work/{slug}': WorkDetailSchema,
      '/about': AboutPageSchema,
      '/contact': ContactPageSchema,
      '/blog': BlogPageSchema,
    })
    .passthrough(), // Allow additional work pages like /work/creazilla, /work/kaluwala
  shared: SharedSchema,
});

// TypeScript types
export type Brand = z.infer<typeof BrandSchema>;
export type Theme = z.infer<typeof ThemeSchema>;
export type Contact = z.infer<typeof ContactSchema>;
export type Legal = z.infer<typeof LegalSchema>;
export type Social = z.infer<typeof SocialSchema>;
export type NavLink = z.infer<typeof NavLinkSchema>;
export type Nav = z.infer<typeof NavSchema>;
export type SEO = z.infer<typeof SEOSchema>;
export type Site = z.infer<typeof SiteSchema>;
export type CTA = z.infer<typeof CTASchema>;
export type Stat = z.infer<typeof StatSchema>;
export type Media = z.infer<typeof MediaSchema>;
export type Hero = z.infer<typeof HeroSchema>;
export type ServiceHighlightItem = z.infer<typeof ServiceHighlightItemSchema>;
export type ServiceHighlights = z.infer<typeof ServiceHighlightsSchema>;
export type GovtCard = z.infer<typeof GovtCardSchema>;
export type GovtFocus = z.infer<typeof GovtFocusSchema>;
export type WorkPreviewItem = z.infer<typeof WorkPreviewItemSchema>;
export type WorkPreview = z.infer<typeof WorkPreviewSchema>;
export type Testimonial = z.infer<typeof TestimonialSchema>;
export type CTABanner = z.infer<typeof CTABannerSchema>;
export type HomePage = z.infer<typeof HomePageSchema>;
export type ServiceItem = z.infer<typeof ServiceItemSchema>;
export type ServiceGroup = z.infer<typeof ServiceGroupSchema>;
export type Plan = z.infer<typeof PlanSchema>;
export type ServicesPage = z.infer<typeof ServicesPageSchema>;
export type ServiceDetail = z.infer<typeof ServiceDetailSchema>;
export type GovernmentPage = z.infer<typeof GovernmentPageSchema>;
export type WorkItem = z.infer<typeof WorkItemSchema>;
export type WorkPage = z.infer<typeof WorkPageSchema>;
export type WorkDetail = z.infer<typeof WorkDetailSchema>;
export type TeamMember = z.infer<typeof TeamMemberSchema>;
export type BadgeItem = z.infer<typeof BadgeItemSchema>;
export type AboutPage = z.infer<typeof AboutPageSchema>;
export type FormField = z.infer<typeof FormFieldSchema>;
export type ContactPage = z.infer<typeof ContactPageSchema>;
export type BlogPost = z.infer<typeof BlogPostSchema>;
export type BlogPage = z.infer<typeof BlogPageSchema>;
export type FAQ = z.infer<typeof FAQSchema>;
export type SharedBadge = z.infer<typeof SharedBadgeSchema>;
export type Shared = z.infer<typeof SharedSchema>;
export type SiteData = z.infer<typeof SiteDataSchema>;
