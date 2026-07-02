# AGENTS.md

## Cursor Cloud specific instructions

This repo is a single-service **Next.js 15 (App Router) + TypeScript + Tailwind** website (`rootz491-web`). All page content is driven by the root `site.json` file, validated by Zod schemas in `src/lib/types.ts`.

### Services

- **Web app** (only service): `npm run dev` starts the Next.js dev server on `http://localhost:3000`. There is no database or other backing service.

### Standard commands

Use the scripts in `package.json`: `npm run dev`, `npm run build`, `npm start`, `npm run lint`. See `README.md` for full docs.

### Non-obvious notes

- The contact form (`POST /api/contact`, page at `/contact`) works end-to-end **without SMTP configured**. Email sending uses `EMAIL_USER`/`EMAIL_PASS`/`CONTACT_EMAIL` env vars, but the route catches email failures and still returns `{ success: true }`. So the happy-path UI/API flow is fully testable with no secrets. Set those env vars only if you need actual email delivery.
- `next.config.js` uses `output: 'standalone'` for the Docker build; this does not affect `npm run dev`.
- `npm run lint` uses `next lint` (prints a deprecation notice but works and passes).
