# AGENTS.md

## Cursor Cloud specific instructions

This repo is a single-service **Next.js 15 (App Router) + TypeScript + Tailwind** personal portfolio (`rootz491-web`). All site content lives in the `content/` folder as JSON files, validated by Zod schemas in `src/lib/content/types.ts`.

### Services

- **Web app** (only service): `npm run dev` starts the Next.js dev server on `http://localhost:3000`. There is no database or other backing service.

### Standard commands

Use the scripts in `package.json`: `npm run dev`, `npm run build`, `npm start`, `npm run lint`. See `README.md` for full docs.

### Non-obvious notes

- Content is split across `content/*.json` (site, profile, about, skills, projects, experience, services, contact, blogs). Edit those files to update copy — no contact form API.
- Resume PDF path: `public/resume/karan-sharma-resume.pdf` (replace with your real resume).
- `next.config.js` uses `output: 'standalone'` for the Docker build; this does not affect `npm run dev`.
- `npm run lint` uses `next lint` (prints a deprecation notice but works and passes).

## UI rules

- Follow the `emil-design-eng` skill (Emil Kowalski, MIT; shared copy at `/home/box/agent-data/workflows/emil-design-eng/`) for any UI or motion work.
- Respect `prefers-reduced-motion`: every animation/transition must be disabled or reduced under `@media (prefers-reduced-motion: reduce)`.
- Put hover effects only behind `@media (hover: hover) and (pointer: fine)`, so touch devices never get sticky hover states.
- Run the `review-animations` and `break-ui` skills before opening any UI PR.
- This site already uses Framer Motion and Lenis: keep those, and add no new motion/animation library.
