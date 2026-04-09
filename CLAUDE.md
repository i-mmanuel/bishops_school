# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint (next/core-web-vitals + TypeScript)
```

## Architecture

**Next.js 14 App Router** with TypeScript (strict mode), Tailwind CSS, and Framer Motion. No backend — all data lives in `lib/mock-data.ts` as in-memory arrays with query functions.

### Data layer

All types are defined in `lib/types.ts`. The mock data file (`lib/mock-data.ts`) contains:
- Hardcoded arrays: `PRINCIPALS`, `DENOMINATIONS`, `CHURCHES`, `CLASSES`, `TEACHERS`, `MODULES`, `STUDENTS`, `SESSIONS`, `ATTENDANCE`
- Query functions: `getStudents()`, `getTeachers()`, `getAttendanceRate()`, `submitSession()`, etc.
- `submitSession()` is the only mutation — it pushes to `SESSIONS` and `ATTENDANCE` in memory

### Key entities and relationships

```
Denomination → Church → Student
Class → TeacherModuleAssignment → Teacher + Module
Session → Class + Module + Topic + Teacher → Attendance (per student)
```

### Routing

| Route | Type | Purpose |
|-------|------|---------|
| `/dashboard` | Server | Overview KPIs (attendance rates, teacher stats) |
| `/attend` | Client | Multi-step attendance form (teacher → class → module → topic → students) |
| `/courses` | Server + Client | Module directory with completion rates |
| `/courses/[id]` | Server | Module detail with topic-level progress |
| `/students` | Server | Directory grouped by class |
| `/students/[id]` | Server | Individual student attendance history |
| `/teachers` | Server | Teacher directory with performance metrics |
| `/teachers/[id]/[classId]` | Server | Teacher's sessions for a specific class |
| `/reports` | Server | Placeholder ("Coming in next release") |

### Design system

- **Colors**: Material Design 3 dark theme — background `#080e1e`, primary blue (`#60a5fa`), secondary emerald (`#34d399`), tertiary rose (`#fb7185`). All custom tokens are in `tailwind.config.ts`.
- **Typography**: Manrope (headlines), Inter (body/labels)
- **Pattern**: Glass morphism with backdrop blur; ambient gradient orbs defined in `app/layout.tsx`
- **Layout**: `components/layout/PrincipalShell.tsx` wraps all pages — desktop sidebar (`Sidebar.tsx`) + mobile bottom nav (`BottomNav.tsx`)

### Auth

Simple React Context in `lib/auth-context.tsx` — compares input against `PRINCIPAL.email`/`PRINCIPAL.password` in mock data. No persistence.
