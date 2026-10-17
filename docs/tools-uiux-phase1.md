# Tools UI/UX — Phase 1 decision record

Spec: tools-uiux-review.md (Phase 1 only: foundation, components, responsive layout, accessibility).

## Target
`rootz491.com/tools` (this repo), not `tools.rootz491.com` (tools-hub).
- It is the cross-domain tools dashboard: it lists tools on tools., paste. and bin.rootz491.com, each with its own icon, and has the
  tall, spacious cards the spec calls out (3 tools above the fold at 1280px before; 12 after).
- tools-hub's index is already a compact list, and it shares `rz-ui.css` with paste/request-bin. Changing it would fork the shared UI.
  This PR does not touch tools-hub or rz-ui.

## What changed
- Tokens: `--surface-hover` and `--border-strong`. The cream/charcoal brand is kept; the spec's blue accent is not used.
  A `pointer-hover:` Tailwind variant wraps hover in `@media (hover: hover) and (pointer: fine)`.
- Components in `src/components/tools/`: ToolIcon, ToolCard, ToolGroup, ToolsToolbar, ToolsEmptyState.
- Pure helpers in `src/lib/tools.ts`, with node:test tests (`npm test`); `npm run typecheck` added.
- Cards are one link each and show icon, name, host + path, and a two-line clamped description, with the new-tab state announced.
  Rows have equal heights, the grid is 1/2/3/4 columns, and the per-card lift and stagger animations are removed.
- Touch targets are 44px on coarse pointers (36px with a fine pointer).
- The existing category chips, search, and live count work as before. The filtering logic moved without changes in behaviour.
  An empty state with a "Clear filters" button was added.

## Deliberately not shown
The content has no source for status, health, deploys, requests, latency or repos, so none of those fields are rendered.
This avoids fabricated values and avoids a page full of "Unknown". Add them only once a real data source exists.

## Before Phase 2
- Search ranking, sorting, grid/list toggle, quick actions and favorites are not built yet.
- The page has no `<h1>`, because the shared SectionHeading renders an h2. This predates the PR.
