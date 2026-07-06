import { z } from 'zod';

export const NavLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

export const SiteSchema = z.object({
  brand: z.object({
    name: z.string(),
    alias: z.string(),
    tagline: z.string(),
    favicon: z.string(),
  }),
  theme: z.object({
    background: z.string(),
    surface: z.string(),
    surfaceElevated: z.string(),
    border: z.string(),
    text: z.string(),
    textMuted: z.string(),
    accent: z.string(),
  }),
  nav: z.object({
    links: z.array(NavLinkSchema),
    resume: NavLinkSchema,
  }),
  seo: z.object({
    defaultTitle: z.string(),
    defaultDescription: z.string(),
    keywords: z.array(z.string()),
    ogImage: z.string(),
    twitter: z.string(),
    url: z.string(),
  }),
  footer: z.object({
    note: z.string(),
  }),
});

export const ProfileSchema = z.object({
  hero: z.object({
    greeting: z.string(),
    name: z.string(),
    alias: z.string(),
    role: z.string(),
    headline: z.string(),
    bio: z.string(),
    avatar: z.string(),
    ctas: z.array(
      z.object({
        label: z.string(),
        href: z.string(),
        variant: z.enum(['primary', 'secondary']),
      })
    ),
  }),
  resume: z.object({
    label: z.string(),
    href: z.string(),
    filename: z.string(),
  }),
});

export const AboutSchema = z.object({
  title: z.string(),
  intro: z.string(),
  bio: z.array(z.string()),
  highlights: z.array(z.string()),
  location: z.string(),
});

export const SkillsSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  categories: z.array(
    z.object({
      name: z.string(),
      items: z.array(z.string()),
    })
  ),
  interests: z
    .object({
      title: z.string(),
      items: z.array(z.string()),
    })
    .optional(),
});

export const ProjectSchema = z.object({
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  role: z.string(),
  thumb: z.string(),
  liveUrl: z.string(),
  githubUrl: z.string(),
  stack: z.array(z.string()),
  kpis: z.array(z.object({ label: z.string(), value: z.string() })),
  challenge: z.string(),
  approach: z.array(z.string()),
});

export const ProjectsSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  items: z.array(ProjectSchema),
});

export const ExperienceRoleSchema = z.object({
  title: z.string(),
  employmentType: z.string().optional(),
  period: z.string(),
  duration: z.string().optional(),
  location: z.string().optional(),
  description: z.string(),
  skills: z.array(z.string()).optional(),
});

export const ExperienceItemSchema = z.object({
  company: z.string(),
  location: z.string().optional(),
  period: z.string(),
  duration: z.string().optional(),
  url: z.string().optional(),
  roles: z.array(ExperienceRoleSchema),
});

export const ExperienceSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  items: z.array(ExperienceItemSchema),
});

export const ServicesSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  items: z.array(
    z.object({
      icon: z.string(),
      title: z.string(),
      description: z.string(),
    })
  ),
});

export const ContactSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  email: z.string(),
  social: z.array(
    z.object({
      platform: z.string(),
      label: z.string(),
      url: z.string(),
      handle: z.string(),
    })
  ),
});

export const BlogPostSchema = z.object({
  title: z.string(),
  url: z.string(),
  date: z.string().optional(),
});

export const BlogPlatformSchema = z.object({
  id: z.string(),
  name: z.string(),
  profileUrl: z.string(),
  icon: z.string(),
  posts: z.array(BlogPostSchema),
});

export const BlogsSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  platforms: z.array(BlogPlatformSchema),
});

export type SiteContent = z.infer<typeof SiteSchema>;
export type ProfileContent = z.infer<typeof ProfileSchema>;
export type AboutContent = z.infer<typeof AboutSchema>;
export type SkillsContent = z.infer<typeof SkillsSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type ProjectsContent = z.infer<typeof ProjectsSchema>;
export type ExperienceContent = z.infer<typeof ExperienceSchema>;
export type ServicesContent = z.infer<typeof ServicesSchema>;
export type ContactContent = z.infer<typeof ContactSchema>;
export type BlogsContent = z.infer<typeof BlogsSchema>;
export type BlogPlatform = z.infer<typeof BlogPlatformSchema>;
