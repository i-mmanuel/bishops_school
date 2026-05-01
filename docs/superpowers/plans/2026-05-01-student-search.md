# Student Search Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a real-time search input to the Students page that filters the teacher → class → student accordion hierarchy by student name, class name, or teacher name.

**Architecture:** All changes are confined to one client component (`StudentClassGroups.tsx`). Search state lives in that component; filtering is a pure derivation on every render from the in-memory `teacherGroups` prop. `ClassAccordion` gains a `forceOpen` prop to support auto-expansion during search.

**Tech Stack:** Next.js 14 App Router, TypeScript (strict), Tailwind CSS, `@phosphor-icons/react`

---

## File Map

| Action | File | Change |
|--------|------|--------|
| Modify | `app/students/StudentClassGroups.tsx` | All changes — `forceOpen` prop, search state, search input UI, filtering, auto-expand, empty state |

No other files are created or modified.

---

### Task 1: Add `forceOpen` prop to `ClassAccordion`

**Files:**
- Modify: `app/students/StudentClassGroups.tsx`

This is a self-contained change to `ClassAccordion`. When `forceOpen` is `true`, the accordion renders open and its toggle button is a no-op. No other component behaviour changes.

- [ ] **Step 1: Update the `ClassAccordion` signature and logic**

Find the `ClassAccordion` function (line ~30). Change its props type and internal logic:

```tsx
function ClassAccordion({ group, forceOpen }: { group: ClassGroup; forceOpen?: boolean }) {
  const [open, setOpen] = useState(false)
  const isOpen = forceOpen ?? open
  return (
    <div
      className="rounded-xl border border-white/[0.06] overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.025)' }}
    >
      <button
        onClick={() => { if (!forceOpen) setOpen(v => !v) }}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
          <span className="text-xs font-black text-primary-dim font-headline">{group.className[0]}</span>
        </div>
        <span className="flex-1 min-w-0 text-sm font-bold font-headline text-on-surface truncate">{group.className}</span>
        <span className="text-xs font-label text-on-surface-variant/50 shrink-0 mr-2">{group.students.length}</span>
        <CaretDown
          size={14}
          weight="bold"
          className={`text-on-surface-variant/40 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="border-t border-white/[0.05] p-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {group.students.map(student => (
              <Link
                key={student.id}
                href={`/students/${student.id}`}
                className="flex items-center gap-3 p-2.5 rounded-lg border border-white/[0.05] hover:border-white/[0.12] transition-colors group"
                style={{ background: 'rgba(255,255,255,0.02)' }}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/[0.08] shrink-0">
                  <Image
                    src={getStudentAvatarUrl(student)}
                    alt={student.name}
                    width={32}
                    height={32}
                    unoptimized={!!student.image}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-on-surface text-sm truncate group-hover:text-primary-dim transition-colors">{student.name}</p>
                  <p className="text-[11px] text-on-surface-variant/50 font-label truncate">{student.country ?? '—'}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
```

Key changes from the original:
- Props: `{ group, forceOpen }` instead of `{ group }`
- `const isOpen = forceOpen ?? open` — `forceOpen` wins when set
- `onClick`: `if (!forceOpen) setOpen(v => !v)` — no-op when forced open
- Use `isOpen` (not `open`) in the JSX conditional and the `rotate-180` class

- [ ] **Step 2: Run lint to verify no type errors**

```bash
npm run lint
```

Expected: no errors. The `forceOpen` prop is optional so no call sites need updating yet.

---

### Task 2: Add search input UI

**Files:**
- Modify: `app/students/StudentClassGroups.tsx`

Add the `MagnifyingGlass` and `X` icon imports, `query` state, and the search input element above the groups.

- [ ] **Step 1: Add icon imports**

The existing import line is:
```tsx
import { CaretDown } from '@phosphor-icons/react'
```

Change it to:
```tsx
import { CaretDown, MagnifyingGlass, X } from '@phosphor-icons/react'
```

- [ ] **Step 2: Add `query` state to `StudentClassGroups`**

Inside `StudentClassGroups`, after the `expanded` state line, add:

```tsx
const [query, setQuery] = useState('')
```

- [ ] **Step 3: Add the search input above the group list**

The component currently returns:
```tsx
return (
  <div className="space-y-4">
    {teacherGroups.map(tg => {
```

Change it to render the search input first:
```tsx
return (
  <div className="space-y-4">
    {/* Search input */}
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.07]"
      style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
    >
      <MagnifyingGlass size={16} weight="bold" className="text-on-surface-variant/50 shrink-0" />
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search students, classes or teachers…"
        className="flex-1 bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none font-label"
      />
      {query && (
        <button
          onClick={() => setQuery('')}
          className="text-on-surface-variant/40 hover:text-on-surface-variant/70 transition-colors shrink-0"
        >
          <X size={14} weight="bold" />
        </button>
      )}
    </div>

    {teacherGroups.map(tg => {
```

- [ ] **Step 4: Run lint**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 5: Spot-check in browser**

Run `npm run dev` and open `http://localhost:3000/students`. The search input should appear above the groups. Typing in it updates state but doesn't filter yet (that's next). The `✕` button should appear while typing and clear the field on click.

---

### Task 3: Add filtering logic, auto-expand, and empty state

**Files:**
- Modify: `app/students/StudentClassGroups.tsx`

This step wires filtering logic, teacher-group auto-expansion during search, recomputed subtitle counts, and the empty state message.

- [ ] **Step 1: Replace `teacherGroups.map` render with `filteredGroups`**

After the `query` and `expanded` state declarations, add the filtering derivation:

```tsx
const normalised = query.trim().toLowerCase()
const isSearching = normalised !== ''

const filteredGroups = isSearching
  ? teacherGroups
      .map(tg => {
        if (tg.teacherName.toLowerCase().includes(normalised)) return tg
        const classes = tg.classes
          .map(cls => {
            if (cls.className.toLowerCase().includes(normalised)) return cls
            const students = cls.students.filter(s =>
              s.name.toLowerCase().includes(normalised)
            )
            return students.length > 0 ? { ...cls, students } : null
          })
          .filter((cls): cls is ClassGroup => cls !== null)
        return classes.length > 0 ? { ...tg, classes } : null
      })
      .filter((tg): tg is TeacherGroup => tg !== null)
  : teacherGroups
```

- [ ] **Step 2: Add empty state and update group render**

Replace the section that renders teacher groups. The full updated return block (after the search input `</div>`) should be:

```tsx
    {/* Empty state */}
    {filteredGroups.length === 0 && (
      <p className="text-on-surface-variant/50 text-sm font-label text-center py-12">
        No students match your search.
      </p>
    )}

    {filteredGroups.map(tg => {
      const isOpen = isSearching || !!expanded[tg.teacherId]
      const visibleStudents = tg.classes.reduce((sum, cls) => sum + cls.students.length, 0)
      return (
        <section
          key={tg.teacherId}
          className="rounded-2xl border border-white/[0.07] overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
        >
          {/* Teacher header */}
          <button
            onClick={() => { if (!isSearching) toggle(tg.teacherId) }}
            className="w-full flex items-center gap-3 p-4 md:p-5 text-left hover:bg-white/[0.02] transition-colors"
          >
            <div
              className="w-10 h-10 rounded-full overflow-hidden shrink-0 ring-2 ring-primary/20"
              style={{ boxShadow: '0 0 12px rgba(124,58,237,0.2)' }}
            >
              <Image
                src={teacherAvatar({ id: tg.teacherId, name: tg.teacherName })}
                alt={tg.teacherName}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base md:text-lg font-bold font-headline text-on-surface truncate">{tg.teacherName}</h2>
              <p className="text-xs text-on-surface-variant/60 font-label">
                {visibleStudents} student{visibleStudents !== 1 ? 's' : ''} · {tg.classes.length} class{tg.classes.length !== 1 ? 'es' : ''}
              </p>
            </div>
            <CaretDown
              size={16}
              weight="bold"
              className={`text-on-surface-variant/40 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Classes within teacher */}
          {isOpen && (
            <div className="border-t border-white/[0.06] p-3 md:p-4 flex flex-col gap-2">
              {tg.classes.map(cls => (
                <ClassAccordion
                  key={cls.classId}
                  group={cls}
                  forceOpen={isSearching ? true : undefined}
                />
              ))}
            </div>
          )}
        </section>
      )
    })}
  </div>
)
```

Key changes from the original render:
- `filteredGroups.map` instead of `teacherGroups.map`
- `isOpen = isSearching || !!expanded[tg.teacherId]` — auto-expand during search
- Teacher button `onClick`: `if (!isSearching) toggle(...)` — no-op during search
- `visibleStudents` derived from filtered `tg.classes` counts
- `ClassAccordion` receives `forceOpen={isSearching ? true : undefined}`
- Empty state rendered when `filteredGroups.length === 0`

- [ ] **Step 3: Run lint**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 4: Run build**

```bash
npm run build
```

Expected: successful build, no TypeScript errors.

- [ ] **Step 5: Manual test in browser**

Run `npm run dev`. Open `http://localhost:3000/students` and verify:

| Test | Expected |
|------|----------|
| Page loads | Search input visible above groups, accordion behaves normally |
| Type a student name (partial) | Matching teacher groups auto-expand, matching classes auto-open, non-matching groups disappear |
| Type a class name | Teacher groups containing that class expand; all students in that class are shown |
| Type a teacher name | That teacher group expands with all their classes and students |
| Type whitespace only (`"   "`) | No filtering — all groups visible, normal accordion behaviour |
| Type something with no matches | All groups hidden, "No students match your search." message shown |
| Click `✕` | Query clears, all groups return to collapsed state |
| Expand a teacher group, then type, then clear | Accordion returns to the expanded state it was in before searching |

- [ ] **Step 6: Commit**

```bash
git add app/students/StudentClassGroups.tsx
git commit -m "feat: add real-time search to students page"
```
