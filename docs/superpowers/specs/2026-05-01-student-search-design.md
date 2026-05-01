# Student Page Search — Design Spec

**Date:** 2026-05-01  
**Status:** Approved

## Overview

Add a search input to the Students page that filters the existing teacher → class → student accordion hierarchy in real time, without a page reload or URL change.

## Scope

- One file changed: `app/students/StudentClassGroups.tsx`
- No new components, no routing changes, no server-side changes

## UI

A full-width search input rendered above the group list inside `StudentClassGroups`:

- **Style:** glass morphism — `border border-white/[0.07]`, `background rgba(255,255,255,0.05)`, `backdrop-blur(12px)`, `rounded-xl`
- **Left icon:** `MagnifyingGlass` from `@phosphor-icons/react`
- **Placeholder:** `"Search students, classes or teachers…"`
- **Right:** `X` clear button (Phosphor `X` icon), visible only when query is non-empty; clicking it resets `query` to `""`
- Student cards retain their normal appearance — no highlight or badge for matched results

## State

```ts
const [query, setQuery] = useState('')
const [expanded, setExpanded] = useState<Record<number, boolean>>({})
```

`expanded` already exists. `query` is the only addition.

## Filtering Logic

Runs on every render (no debounce needed — data is in-memory).

```
normalised = query.trim().toLowerCase()

// Whitespace-only queries (e.g. "   ") produce normalised === ""
// and are treated the same as an empty query — no filtering applied.

if normalised === '' → filteredGroups = teacherGroups (unchanged)

otherwise, for each teacherGroup:
  if teacherName includes normalised
    → include group as-is (all classes, all students)
  else
    filter classes:
      if className includes normalised
        → include class as-is (all students)
      else
        keep only students where studentName includes normalised
        drop class if 0 students remain
    drop teacherGroup if 0 classes remain
```

The teacher header subtitle (`X students · Y classes`) must be recomputed from the filtered class/student counts, not from the original `tg.totalStudents` / `tg.classes.length` props. This keeps the counts consistent with what is actually visible.

## Expand Behaviour

`ClassAccordion` currently manages its own `open` state internally. To support forced-open during search, add an optional `forceOpen?: boolean` prop to `ClassAccordion`. When `forceOpen` is `true`, the component renders as open and the toggle button click is a no-op (the user cannot manually collapse a class accordion while a search is active). This avoids stale internal state when the search is later cleared.

When `normalised` is non-empty, all filtered teacher groups auto-expand (override `expanded` check) and their class accordions receive `forceOpen={true}`.

When query is cleared, `expanded` state resumes control for teacher groups, and `ClassAccordion` components receive no `forceOpen` prop (defaulting to their own internal state, which remains at its last value before the search).

## Empty State

If `filteredGroups` is empty after filtering, render a centred message below the search input:

```
No students match your search.
```

Styled with `text-on-surface-variant/50 text-sm font-label text-center py-12`.

## Out of Scope

- Country / nationality is not a search field
- No URL persistence (`?q=`)
- No debounce
- No result count badge
- No keyboard navigation within results
