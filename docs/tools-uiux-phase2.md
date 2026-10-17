# Tools UI/UX — Phase 2 decision record

Builds on `docs/tools-uiux-phase1.md`. Spec: tools-uiux-review.md (Phase 2).

## What was added

- **Search**: matches name, description, category, slug and domain + path. It ignores case, punctuation and diacritics, and every word must match ("hash/hmac", "Base-64", "paste.rootz491" all work). No fuzzy dependency.
- Page title is now the `<h1>` (`SectionHeading as="h1"`), with groups as `<h2>`.
- **View switch**: Grid / List. Grid keeps the 1/2/3/4-column card grid; List is one column of dense rows
  (icon | name + domain | description | category | actions). Switching is instant — no animation.
- **Sort**: native `<select>` — "Default order" (content order) and "Name A–Z" (locale-aware, numeric).
- **Favorites**: a star toggle per tool. Favorited tools are pulled into a "Favorites" group shown first and
  are removed from their category group, so a tool never appears twice.
- **Quick actions** per tool, kept outside the link (never nested inside the `<a>`): favorite toggle and
  copy-URL. Copy uses `navigator.clipboard` and reports success/failure through the toast.
- **Keyboard**: `/` focuses the search input (ignored while typing in a field or with a modifier held);
  Escape in a non-empty search clears the query and keeps focus; the focus ring moves to the whole card via
  `has-[a:focus-visible]`, with the link's own ring suppressed.
- **Toast** (`src/components/tools/Toast.tsx`): a persistent `role="status"` / `aria-live="polite"`
  container, bottom-centre and safe-area aware, that shows a message for 2000 ms.
- **Empty state** copy: "No tools match this search" (non-empty query) / "No tools in this category".

Action buttons are 44 px on coarse pointers and 32 px with a fine pointer. On fine pointers the copy button
(and the favorite toggle while inactive) reveal on card hover or keyboard focus, and stay visible on touch.

## Storage

Prefs are read in a `useEffect` after mount — the first render uses the defaults so server and client match —
and written back whenever they change (once the initial load has run):

- `rz-tools:view` — `grid` | `list`
- `rz-tools:sort` — `default` | `name`
- `rz-tools:favorites` — JSON array of tool slugs, validated against the current tools on load

## Deliberately not built

A "recently updated" sort, GitHub / details actions, a density control, and any status, health, deploy,
request or latency metric. `content/tools.json` has no data source for them, so nothing is rendered rather
than showing fabricated values or a page full of "Unknown".
