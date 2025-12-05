# ROOTZ491 Website

Production-ready Next.js website with TypeScript, Tailwind CSS, and JSON-driven content architecture.

## Features

- ✅ **Next.js 14+ App Router** with TypeScript
- ✅ **Tailwind CSS** + shadcn/ui components
- ✅ **JSON-driven content** - all site content from `site.json`
- ✅ **SEO optimized** with metadata and structured data
- ✅ **Accessible** - WCAG AA compliant
- ✅ **Security** - Headers, rate limiting, input validation
- ✅ **Government-ready** - Compliance & procurement focused
- ✅ **Performance** - Optimized for Core Web Vitals

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone repository
git clone <repository-url>
cd rootz491-web

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
rootz491-web/
├── src/
│   ├── app/              # Next.js pages (App Router)
│   │   ├── page.tsx      # Homepage
│   │   ├── services/     # Services pages
│   │   ├── government/   # Government page
│   │   ├── work/         # Case studies
│   │   ├── about/        # About page
│   │   ├── contact/      # Contact form
│   │   ├── blog/         # Blog listing
│   │   ├── legal/        # Legal pages
│   │   └── api/          # API routes
│   ├── components/       # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── Header.tsx    # Site header
│   │   └── Footer.tsx    # Site footer
│   └── lib/              # Utilities
│       ├── types.ts      # TypeScript types & zod schemas
│       ├── content.ts    # Content loader
│       ├── seo.ts        # SEO helpers
│       └── utils.ts      # Utility functions
├── public/               # Static assets
├── site.json             # Site content (single source of truth)
├── .env.example          # Environment variables template
└── README.md
```

## Content Management

All site content is managed through `site.json`. This file contains:

- Site configuration (branding, contact, legal)
- Page content (homepage, services, work, etc.)
- Navigation structure
- Shared content (FAQs, badges)

### Updating Content

1. Edit `site.json` with your content changes
2. The changes will be reflected immediately in development
3. For production, rebuild and redeploy

### Content Schema

The content is validated using Zod schemas defined in `src/lib/types.ts`. This ensures type safety and prevents invalid
data.

## Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Environment Variables

Create `.env.local` file with the following variables:

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
CONTACT_EMAIL=contact@yourdomain.com
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

```bash
# Or use Vercel CLI
npx vercel
```

### Docker

```bash
# Build image
docker build -t rootz491-web .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SITE_URL=https://yourdomain.com \
  rootz491-web
```

### Manual Deployment

```bash
# Build
npm run build

# Copy .next, public, package.json, and node_modules to server
# Start with PM2 or similar process manager
pm2 start npm --name "rootz491-web" -- start
```

## Adding New Pages

1. Create new page in `src/app/your-page/page.tsx`
2. Add page content to `site.json` under `pages` key
3. Update TypeScript types in `src/lib/types.ts` if needed
4. Add navigation link in `site.json` under `site.nav.primary`

## Contact Form Setup

The contact form uses **nodemailer** to send emails via SMTP:

1. **Set environment variables** in `.env.local`:

   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM_NAME=ROOTZ491 Website
   CONTACT_EMAIL=rootz491@wearehackerone.com
   ```

2. **Gmail Example** (using App Password):

   - Enable 2FA on your Google account
   - Generate an App Password at https://myaccount.google.com/apppasswords
   - Use the 16-character password as `SMTP_PASS`

3. **Other SMTP Providers**:

   - **SendGrid**: `smtp.sendgrid.net` (port 587)
   - **Mailgun**: `smtp.mailgun.org` (port 587)
   - **AWS SES**: `email-smtp.region.amazonaws.com` (port 587)
   - **Custom**: Use your hosting provider's SMTP settings

4. **Email Features**:
   - HTML formatted emails with branding
   - Plain text fallback
   - Reply-to set to sender's contact info
   - Rate limiting (3 requests per minute per IP)
   - Honeypot spam protection

## Security Features

- Security headers via middleware
- Input validation with Zod
- Rate limiting on contact form
- Honeypot field for spam prevention
- No sensitive data exposure (masked certificate numbers)

## Performance Optimization

- Static generation for all pages
- Image optimization with next/image
- Font optimization with next/font
- Tailwind CSS purging
- Lazy loading components

## Accessibility

- Semantic HTML throughout
- ARIA labels where needed
- Keyboard navigation support
- Color contrast WCAG AA compliant
- Screen reader friendly

## License

Proprietary - © 2025 ROOTZ491

## Support

For issues or questions:

- Email: rootz491@wearehackerone.com
- GitHub Issues: [repository-url]/issues
