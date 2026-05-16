# Teacher Targets → Lesson Coverage Metric

**Date:** 2026-05-16
**Status:** Approved design, pending implementation plan
**Repos affected:** `bishops-school-api` (logic + response), `course_tracker` (type only)

## Problem

The dashboard "Teachers Targets" widget shows a percentage + progress bar per
teacher. Today that percentage is a **student-attendance rate**: present
attendance records ÷ total attendance records across the teacher's sessions
(`DashboardController.php:38-49`).

That is the wrong metric. The intent is to track whether **each teacher has
taught every lesson in the modules they are assigned**. A teacher whose
students happen to attend well scores high even if they have taught only one
chapter; a teacher who has delivered every lesson but to a sparse class scores
low. The number must measure lesson *coverage*, not attendance.

## Desired metric

For each teacher, a single pooled coverage percentage:

```
rate = (distinct chapters the teacher has taught
        across all modules they are assigned)
       ÷ (total chapters across all those modules)
       × 100
```

- **Pooled**, not averaged: a 40-chapter module weighs more than a 2-chapter
  one. Averaging per-module %s would hide large gaps behind small finished
  modules.
- **Class-agnostic**: the teacher is assigned a module for a class via
  `TeacherModuleAssignment`, but a chapter counts as covered if taught in *any*
  of their classes.
- **Attendance-agnostic**: a chapter is "taught" if at least one `Session` row
  exists for it by that teacher. Whether students were present is irrelevant.

## Data model recap

- `TeacherModuleAssignment` (`teacher_id`, `module_id`, `class_id`) — which
  modules a teacher is responsible for.
- `Module` has many `Book`; each `Book` has a `chapters` JSON array. A module's
  lessons = every chapter across all its books.
- `Session` (`teacher_id`, `class_id`, `module_id`, `book_id`,
  `chapter_index`, `date`) — one chapter delivered.

## Calculation (Approach A — in-place rewrite)

Replaces the `teacher_targets` block in `DashboardController.php:38-49`. Uses
the same Eloquent `->map()` style already used elsewhere in that file. Dataset
is one school; per-teacher iteration is fine, no SQL optimization needed.

For each teacher (still iterate `Teacher::all()` so every teacher appears,
even at 0%):

1. **Assigned modules** — distinct `module_id`s from
   `TeacherModuleAssignment` where `teacher_id = teacher.id`.
2. **Denominator** — load those modules with `books`; sum
   `count($book->chapters)` across every book of every assigned module.
3. **Numerator** — from `sessions` where `teacher_id = teacher.id` and
   `module_id` in the assigned set, collect distinct
   `(module_id, book_id, chapter_index)` triples. Count only triples where
   `chapter_index < count(book.chapters)` for that book (guards stale indices
   left by later chapter edits, so the result cannot exceed 100%).
4. `rate = denominator > 0 ? round(numerator / denominator * 100, 1) : 0.0`

## Edge cases

| Case | Behaviour |
|------|-----------|
| Teacher has no assignments | denominator 0 → `rate = 0.0`, still listed |
| Assigned module with no books / empty chapters | contributes 0 to denominator |
| Session for a module no longer assigned | excluded (numerator restricted to current assigned set) |
| Same chapter taught twice or in two classes | counted once (distinct triples) |
| `chapter_index` beyond book's current chapters | triple skipped, rate ≤ 100 |

## The `rating` field

`teacher_targets` currently also returns
`rating` ∈ {Excellent, Good, Needs Improvement}. The frontend never reads it
(`dashboard/page.tsx` uses only `id`, `name`, `rate`); it is also declared in
`lib/api-types.ts` `TeacherTarget`.

**Decision: remove it.** Applying attendance-style thresholds to a coverage
number produces a meaningless, misleading field. A clean deletion beats a dead
wrong field.

## Response shape & frontend impact

`teacher_targets` entry: `{ id, name, rate, rating }` → `{ id, name, rate }`.
`rate` remains a 0–100 float (now coverage).

- `course_tracker/app/dashboard/page.tsx` — **no change**. Uses `id`, `name`,
  `rate`. `rateColor` thresholds (80/65) and bar width work unchanged on a
  0–100 number.
- `course_tracker/lib/api-types.ts` — drop `rating` from `TeacherTarget`;
  delete the now-unused `'Excellent' | 'Good' | 'Needs Improvement'` union.
- Other `DashboardData` fields (overall attendance, counts) — unchanged, out
  of scope.

## Testing

**Backend** (`bishops-school-api`, PHPUnit, `tests/` exists):

- Teacher assigned one module, taught a subset of chapters → correct pooled %.
- Teacher assigned two modules of different sizes → confirms pooling weights
  by chapter count, not averaged.
- Teacher with no assignments → `0.0`.
- Same chapter taught in two classes → counted once.
- `chapter_index` beyond book's chapters → excluded, rate ≤ 100.

**Frontend**: `npx tsc --noEmit` confirms the `api-types.ts` change compiles;
dashboard renders unchanged.

## Out of scope

- Per-module drill-down UI (the pooled number is the only thing displayed).
- Any change to other dashboard metrics or the `/attendance-overview`,
  `/teachers/{id}/stats` endpoints.
- Backend local-run setup, auth.
