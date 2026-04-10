# Admin Infrastructure + Classes CRUD + Module Structure Redesign

**Date:** 2026-04-10
**Status:** Approved

## Summary

Two parallel changes delivered together:

1. **Admin infrastructure** — a dedicated `/admin` section with its own shell, nav integration, and a runtime mutation layer. First live entity: **Classes** (full CRUD).
2. **Module structure redesign** — deepen the content hierarchy from `Module → Topics` to `Module → Books → Chapters`. Attendance is marked at the Chapter level. Existing read-only pages updated to reflect the new structure.

The remaining admin entities (Teachers, Students, Modules) are placeholder routes in this spec and will be built in follow-on specs.

---

## Data Model Changes

### New type: `Book`

```ts
export interface Book {
  id: string
  name: string
  chapters: string[]
}
```

### `Module` — replace `topics` with `books`

```ts
export interface Module {
  id: string
  name: string
  code: string
  books: Book[]   // replaces topics: string[]
}
```

### `Session` — replace `topicIndex` with `bookId` + `chapterIndex`

```ts
export interface Session {
  id: string
  classId: string
  moduleId: string
  teacherId: string
  date: string
  bookId: string       // replaces topicIndex
  chapterIndex: number
}
```

### `Student.classId`

Stays `string`. An empty string `''` means the student is unassigned (set when their class is deleted). No type change.

---

## Seed Data Migration

All existing `Module` records in `lib/mock-data.ts` must be restructured. Each current `topics` string entry becomes a `Book` with at least one `chapters` entry.

Example — current:
```ts
{ id: 'm1', name: 'Loyalty', code: 'L', topics: ['Introduction', 'Week 2', 'Week 3'] }
```
Becomes:
```ts
{
  id: 'm1', name: 'Loyalty', code: 'L',
  books: [
    { id: 'b1-1', name: 'Introduction', chapters: ['Chapter 1', 'Chapter 2'] },
    { id: 'b1-2', name: 'Week 2',       chapters: ['Chapter 1', 'Chapter 2'] },
    { id: 'b1-3', name: 'Week 3',       chapters: ['Chapter 1', 'Chapter 2'] },
  ]
}
```

All 16 `SESSIONS` must be updated: replace `topicIndex` with a valid `bookId` from the restructured module data and a `chapterIndex` (0-based) within that book's `chapters` array.

---

## Mutation Layer

### Runtime arrays (added to `lib/mock-data.ts`)

```ts
const runtimeClasses: Class[] = []
```

### New query function updates

- `getClasses()` → merges `[...CLASSES, ...runtimeClasses]`

### New mutation functions

```ts
export function addClass(name: string, teacherId: string): Class
// Generates a new id, pushes to runtimeClasses, returns new Class

export function updateClass(id: string, patch: { name?: string; teacherId?: string }): void
// Finds class in CLASSES or runtimeClasses, applies patch in place

export function deleteClass(id: string): void
// Removes class from runtimeClasses (or marks CLASSES entry as deleted via a runtimeDeletedClassIds Set)
// Sets classId → '' on all students in runtimeStudents and STUDENTS whose classId matches
```

**Note:** `STUDENTS` is a `const` array — `deleteClass` must handle this by maintaining a `runtimeStudentPatches: Record<string, Partial<Student>>` map, merged in `getStudents()` and `getStudentsByClass()`. Students with `classId: ''` are considered unassigned.

---

## New Routes

| Route | File | Purpose |
|-------|------|---------|
| `/admin` | `app/admin/page.tsx` | `redirect('/admin/classes')` |
| `/admin/classes` | `app/admin/classes/page.tsx` | Classes list + CRUD |
| `/admin/teachers` | `app/admin/teachers/page.tsx` | Placeholder |
| `/admin/students` | `app/admin/students/page.tsx` | Placeholder |
| `/admin/modules` | `app/admin/modules/page.tsx` | Placeholder |

All admin pages are client components (CRUD requires interactivity).

---

## New Components

### `components/layout/AdminShell.tsx`

Mirrors `PrincipalShell` in layout (ambient gradient, glass surface). Renders an admin-specific sidebar sub-nav:

- Classes → `/admin/classes`
- Teachers → `/admin/teachers`
- Students → `/admin/students`
- Modules → `/admin/modules`

Mobile: uses a top tab-bar or the existing `BottomNav` with the Admin entry active.

### `app/admin/classes/page.tsx`

Client component. Table columns: **Name**, **Teacher**, **Students** (count). Per-row actions: Edit, Delete.

- **Edit** — inline row edit: name text input + teacher dropdown (all teachers). Save / Cancel.
- **Delete** — immediate, no confirmation. Calls `deleteClass(id)`.
- **New Class** button at top → toggles an inline create form: name input + teacher dropdown. Submit calls `addClass(name, teacherId)`.

---

## Navigation Changes

### `components/layout/Sidebar.tsx`

Add "Admin" nav item (icon: `GearSix`) below existing items, linking to `/admin/classes`.

### `components/layout/BottomNav.tsx`

Add "Admin" nav item (icon: `GearSix`) in the bottom nav tab strip, linking to `/admin/classes`.

---

## Existing Page Updates (Module → Books → Chapters)

### `/attend` (`app/attend/page.tsx`)

Updated selection flow: Teacher → Class → **Module → Book → Chapter** → Students → Submit

- Add `bookId` state and `chapterId`/`chapterIndex` state
- After module is selected, show Book dropdown (books from selected module)
- After book is selected, show Chapter dropdown (chapters from selected book)
- `submitSession()` updated to accept `bookId` + `chapterIndex` instead of `topicIndex`

### `/courses/[id]` (`app/courses/[id]/page.tsx`)

Replace flat topic list with a Books accordion or grouped list. Each Book shows its Chapters with taught/untaught status. Update `getModuleTopicStats()` → `getModuleBookStats()` or equivalent function that operates on the new structure.

### `/students/[id]` (`app/students/[id]/page.tsx`)

`getRecentAttendanceHistory()` currently shows `moduleName`. Update to also show book name and chapter name: e.g., "Loyalty › Week 2 › Chapter 1".

### `/teachers/[id]/[classId]` (`app/teachers/[id]/[classId]/page.tsx`)

Session rows currently show topic name via `topicIndex`. Update to show book name + chapter name using `session.bookId` + `session.chapterIndex`.

---

## Query Function Updates

- `getModuleTopicStats(moduleId)` → rewrite to iterate books and chapters
- `getModuleCompletionRate(moduleId)` → rewrite: completion = % of (book, chapter) pairs that have been taught
- `getRecentAttendanceHistory()` → include book + chapter name in output
- `submitSession()` → accept `bookId: string` + `chapterIndex: number`, remove `topicIndex`

---

## Out of Scope

- Teachers, Students, Modules admin CRUD (follow-on specs)
- Data persistence across page reloads (mock data is always in-memory)
- Role-based access control (single principal, always logged in)
- Reordering books or chapters via drag-and-drop
