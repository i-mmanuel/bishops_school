# Teacher Targets Lesson-Coverage Metric Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Change the dashboard "Teachers Targets" percentage from a student-attendance rate to a pooled lesson-coverage rate (chapters the teacher has taught ÷ chapters across their assigned modules), and drop the unused `rating` field.

**Architecture:** Backend-only logic change in `bishops-school-api` `DashboardController` (in-place rewrite of the `teacher_targets` map block), plus a one-line type change in `course_tracker` `lib/api-types.ts`. Two separate git repos, two commit streams. TDD against the existing PHPUnit suite (sqlite `:memory:`, `RefreshDatabase`, manual `Model::create()` — no factories).

**Tech Stack:** Laravel 13 / PHP 8.3 / PHPUnit (backend); Next.js / TypeScript (frontend).

**Spec:** `docs/superpowers/specs/2026-05-16-teacher-target-coverage-design.md`

---

## File Structure

- `bishops-school-api/app/Http/Controllers/Api/DashboardController.php` — rewrite the `$teacherTargets` block (currently lines 38-49); add two model imports. Single responsibility unchanged: assemble dashboard JSON.
- `bishops-school-api/tests/Feature/DashboardTest.php` — replace the obsolete `test_teacher_targets_include_rating` with coverage-metric tests.
- `course_tracker/lib/api-types.ts` — remove `rating` from `TeacherTarget`.

No new files. No frontend component changes (`app/dashboard/page.tsx` reads only `id`, `name`, `rate`).

---

## Task 0: Backend tooling prerequisite

PHP and Composer are not installed locally; the backend test suite cannot run without them. This task is environment setup, not TDD.

**Files:** none.

- [ ] **Step 1: Install PHP and Composer**

This is best run by the user in the session prompt (interactive Homebrew):

Run: `! brew install php composer`
Expected: `php --version` reports PHP 8.3+, `composer --version` reports a version.

- [ ] **Step 2: Install backend dependencies**

Run: `cd /Users/emmanuel/Documents/bishops-school-api && composer install`
Expected: `vendor/` directory created, no errors.

- [ ] **Step 3: Verify the existing suite runs (baseline)**

Run: `cd /Users/emmanuel/Documents/bishops-school-api && php artisan test --filter=DashboardTest`
Expected: 3 tests run. `test_teacher_targets_include_rating` PASSES against the *old* attendance logic (this is the baseline we will intentionally break in Task 1).

---

## Task 1: Replace teacher_targets with lesson-coverage logic

**Files:**
- Modify: `bishops-school-api/app/Http/Controllers/Api/DashboardController.php` (imports near top; `$teacherTargets` block currently lines 38-49)
- Test: `bishops-school-api/tests/Feature/DashboardTest.php` (replace `test_teacher_targets_include_rating`, lines 52-69)

- [ ] **Step 1: Replace the obsolete test with coverage tests**

In `tests/Feature/DashboardTest.php`, ensure these imports are present in the `use` block at the top (add any missing):

```php
use App\Models\Book;
use App\Models\Module;
use App\Models\SchoolClass;
use App\Models\Session;
use App\Models\Teacher;
use App\Models\TeacherModuleAssignment;
```

Delete the entire `test_teacher_targets_include_rating` method (lines 52-69) and replace it with:

```php
public function test_teacher_target_is_pooled_lesson_coverage(): void
{
    $class = SchoolClass::create(['name' => 'Makarios']);
    $teacher = Teacher::create(['name' => 'Pastor Emmanuel']);
    $module = Module::create(['name' => 'Loyalty', 'code' => 'L']);
    // 4 chapters total in the module.
    $book = Book::create(['module_id' => $module->id, 'name' => 'B1', 'chapters' => ['c0', 'c1', 'c2', 'c3'], 'position' => 0]);

    TeacherModuleAssignment::create(['teacher_id' => $teacher->id, 'module_id' => $module->id, 'class_id' => $class->id]);

    // Taught 2 of 4 chapters → 50.0%
    foreach ([0, 1] as $idx) {
        Session::create(['class_id' => $class->id, 'module_id' => $module->id, 'book_id' => $book->id, 'chapter_index' => $idx, 'teacher_id' => $teacher->id, 'date' => now()->toDateString()]);
    }

    $response = $this->getJson('/api/dashboard');
    $response->assertOk()
        ->assertJsonPath('data.teacher_targets.0.name', 'Pastor Emmanuel')
        ->assertJsonPath('data.teacher_targets.0.rate', 50.0);
}

public function test_teacher_target_pools_across_modules_weighted_by_chapter_count(): void
{
    $class = SchoolClass::create(['name' => 'Makarios']);
    $teacher = Teacher::create(['name' => 'Pastor Emmanuel']);

    $big = Module::create(['name' => 'Big', 'code' => 'BIG']);
    $bigBook = Book::create(['module_id' => $big->id, 'name' => 'BB', 'chapters' => ['0','1','2','3','4','5','6','7','8','9'], 'position' => 0]); // 10 chapters
    $small = Module::create(['name' => 'Small', 'code' => 'SML']);
    $smallBook = Book::create(['module_id' => $small->id, 'name' => 'SB', 'chapters' => ['0','1'], 'position' => 0]); // 2 chapters

    TeacherModuleAssignment::create(['teacher_id' => $teacher->id, 'module_id' => $big->id, 'class_id' => $class->id]);
    TeacherModuleAssignment::create(['teacher_id' => $teacher->id, 'module_id' => $small->id, 'class_id' => $class->id]);

    // Big: taught 5/10. Small: taught 2/2. Pooled = 7/12 = 58.3 (NOT avg of 50% & 100% = 75%).
    foreach ([0,1,2,3,4] as $idx) {
        Session::create(['class_id' => $class->id, 'module_id' => $big->id, 'book_id' => $bigBook->id, 'chapter_index' => $idx, 'teacher_id' => $teacher->id, 'date' => now()->toDateString()]);
    }
    foreach ([0,1] as $idx) {
        Session::create(['class_id' => $class->id, 'module_id' => $small->id, 'book_id' => $smallBook->id, 'chapter_index' => $idx, 'teacher_id' => $teacher->id, 'date' => now()->toDateString()]);
    }

    $response = $this->getJson('/api/dashboard');
    $response->assertJsonPath('data.teacher_targets.0.rate', 58.3);
}

public function test_teacher_with_no_assignments_has_zero_rate(): void
{
    Teacher::create(['name' => 'Idle Teacher']);

    $response = $this->getJson('/api/dashboard');
    $response->assertJsonPath('data.teacher_targets.0.rate', 0.0);
}

public function test_chapter_taught_in_two_classes_counts_once(): void
{
    $classA = SchoolClass::create(['name' => 'A']);
    $classB = SchoolClass::create(['name' => 'B']);
    $teacher = Teacher::create(['name' => 'T']);
    $module = Module::create(['name' => 'M', 'code' => 'M']);
    $book = Book::create(['module_id' => $module->id, 'name' => 'B', 'chapters' => ['c0', 'c1'], 'position' => 0]); // 2 chapters

    TeacherModuleAssignment::create(['teacher_id' => $teacher->id, 'module_id' => $module->id, 'class_id' => $classA->id]);

    // Same chapter 0 taught for two classes → still 1 distinct chapter of 2 → 50.0
    Session::create(['class_id' => $classA->id, 'module_id' => $module->id, 'book_id' => $book->id, 'chapter_index' => 0, 'teacher_id' => $teacher->id, 'date' => now()->toDateString()]);
    Session::create(['class_id' => $classB->id, 'module_id' => $module->id, 'book_id' => $book->id, 'chapter_index' => 0, 'teacher_id' => $teacher->id, 'date' => now()->toDateString()]);

    $response = $this->getJson('/api/dashboard');
    $response->assertJsonPath('data.teacher_targets.0.rate', 50.0);
}

public function test_stale_chapter_index_is_excluded(): void
{
    $class = SchoolClass::create(['name' => 'A']);
    $teacher = Teacher::create(['name' => 'T']);
    $module = Module::create(['name' => 'M', 'code' => 'M']);
    $book = Book::create(['module_id' => $module->id, 'name' => 'B', 'chapters' => ['c0', 'c1'], 'position' => 0]); // 2 chapters

    TeacherModuleAssignment::create(['teacher_id' => $teacher->id, 'module_id' => $module->id, 'class_id' => $class->id]);

    // chapter_index 0 valid; index 5 is stale (book only has 2 chapters) → only 1/2 counted = 50.0
    Session::create(['class_id' => $class->id, 'module_id' => $module->id, 'book_id' => $book->id, 'chapter_index' => 0, 'teacher_id' => $teacher->id, 'date' => now()->toDateString()]);
    Session::create(['class_id' => $class->id, 'module_id' => $module->id, 'book_id' => $book->id, 'chapter_index' => 5, 'teacher_id' => $teacher->id, 'date' => now()->toDateString()]);

    $response = $this->getJson('/api/dashboard');
    $response->assertJsonPath('data.teacher_targets.0.rate', 50.0);
}

public function test_teacher_targets_do_not_include_rating(): void
{
    $class = SchoolClass::create(['name' => 'A']);
    $teacher = Teacher::create(['name' => 'T']);
    $module = Module::create(['name' => 'M', 'code' => 'M']);
    Book::create(['module_id' => $module->id, 'name' => 'B', 'chapters' => ['c0'], 'position' => 0]);
    TeacherModuleAssignment::create(['teacher_id' => $teacher->id, 'module_id' => $module->id, 'class_id' => $class->id]);

    $response = $this->getJson('/api/dashboard');
    $data = $response->json('data.teacher_targets.0');
    $this->assertArrayNotHasKey('rating', $data);
    $this->assertEqualsCanonicalizing(['id', 'name', 'rate'], array_keys($data));
}
```

- [ ] **Step 2: Run the new tests and verify they fail**

Run: `cd /Users/emmanuel/Documents/bishops-school-api && php artisan test --filter=DashboardTest`
Expected: the 5 new coverage tests FAIL (old logic ignores assignments and computes attendance), and `test_teacher_targets_do_not_include_rating` FAILS because the old response still has a `rating` key. `test_dashboard_returns_correct_structure` and `test_dashboard_returns_zeros_with_no_data` still PASS.

- [ ] **Step 3: Add the two model imports to the controller**

In `app/Http/Controllers/Api/DashboardController.php`, the existing import block is:

```php
use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Module;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Http\JsonResponse;
```

Add `Session` and `TeacherModuleAssignment` so it reads:

```php
use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Module;
use App\Models\SchoolClass;
use App\Models\Session;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\TeacherModuleAssignment;
use Illuminate\Http\JsonResponse;
```

- [ ] **Step 4: Replace the `$teacherTargets` block**

In the same file, replace this exact block (currently lines 38-49):

```php
        // Teacher targets
        $teacherTargets = Teacher::all()->map(function ($teacher) {
            $total = Attendance::whereHas('session', fn ($q) => $q->where('teacher_id', $teacher->id))->count();
            $present = Attendance::whereHas('session', fn ($q) => $q->where('teacher_id', $teacher->id))
                ->where('status', 'present')->count();
            $rate = $total > 0 ? (float) round(($present / $total) * 100, 1) : 0;
            return [
                'id' => $teacher->id,
                'name' => $teacher->name,
                'rate' => $rate,
                'rating' => $rate >= 85 ? 'Excellent' : ($rate >= 70 ? 'Good' : 'Needs Improvement'),
            ];
        });
```

with:

```php
        // Teacher targets: pooled lesson coverage across assigned modules.
        $teacherTargets = Teacher::all()->map(function ($teacher) {
            $moduleIds = TeacherModuleAssignment::where('teacher_id', $teacher->id)
                ->distinct()->pluck('module_id');

            $modules = Module::with('books')->whereIn('id', $moduleIds)->get();

            // book_id => chapter count, for every book in the assigned modules.
            $bookChapterCount = [];
            $totalChapters = 0;
            foreach ($modules as $module) {
                foreach ($module->books as $book) {
                    $count = count($book->chapters ?? []);
                    $bookChapterCount[$book->id] = $count;
                    $totalChapters += $count;
                }
            }

            // Distinct (book_id, chapter_index) taught within assigned modules,
            // ignoring indices that no longer exist in the book.
            $taught = Session::where('teacher_id', $teacher->id)
                ->whereIn('module_id', $moduleIds)
                ->get(['book_id', 'chapter_index'])
                ->filter(fn ($s) => isset($bookChapterCount[$s->book_id])
                    && $s->chapter_index < $bookChapterCount[$s->book_id])
                ->unique(fn ($s) => $s->book_id . '-' . $s->chapter_index)
                ->count();

            $rate = $totalChapters > 0
                ? (float) round(($taught / $totalChapters) * 100, 1)
                : 0.0;

            return [
                'id' => $teacher->id,
                'name' => $teacher->name,
                'rate' => $rate,
            ];
        });
```

- [ ] **Step 5: Run the full DashboardTest suite and verify it passes**

Run: `cd /Users/emmanuel/Documents/bishops-school-api && php artisan test --filter=DashboardTest`
Expected: all tests PASS (2 original structure tests + 6 new coverage tests).

- [ ] **Step 6: Run the full backend suite for regressions**

Run: `cd /Users/emmanuel/Documents/bishops-school-api && php artisan test`
Expected: full suite green. (No other controller reads `teacher_targets`; `TeacherStatsTest` is unaffected.)

- [ ] **Step 7: Commit (bishops-school-api repo)**

```bash
cd /Users/emmanuel/Documents/bishops-school-api
git add app/Http/Controllers/Api/DashboardController.php tests/Feature/DashboardTest.php
git commit -m "feat: teacher targets measure pooled lesson coverage instead of attendance"
```

---

## Task 2: Remove `rating` from the frontend type

**Files:**
- Modify: `course_tracker/lib/api-types.ts` (the `TeacherTarget` interface, currently lines 96-101)

- [ ] **Step 1: Edit the type**

In `lib/api-types.ts`, replace:

```ts
export interface TeacherTarget {
  id: number
  name: string
  rate: number
  rating: 'Excellent' | 'Good' | 'Needs Improvement'
}
```

with:

```ts
export interface TeacherTarget {
  id: number
  name: string
  rate: number
}
```

- [ ] **Step 2: Typecheck**

Run: `cd /Users/emmanuel/Documents/course_tracker && npx tsc --noEmit`
Expected: "TypeScript compilation completed" with no errors. (`app/dashboard/page.tsx` never referenced `rating`, so nothing else breaks.)

- [ ] **Step 3: Commit (course_tracker repo)**

```bash
cd /Users/emmanuel/Documents/course_tracker
git add lib/api-types.ts
git commit -m "refactor: drop unused rating field from TeacherTarget"
```

---

## Self-Review

**Spec coverage:**
- Pooled coverage formula → Task 1 Step 4 + `test_teacher_target_is_pooled_lesson_coverage`, `test_..._pools_across_modules_weighted_by_chapter_count`.
- Class-agnostic → `test_chapter_taught_in_two_classes_counts_once`.
- Attendance-agnostic → no attendance rows in coverage tests; logic queries `Session` only.
- No assignments → 0.0 → `test_teacher_with_no_assignments_has_zero_rate`.
- Stale chapter_index guard → `test_stale_chapter_index_is_excluded`.
- Remove `rating` (backend) → `test_teacher_targets_do_not_include_rating` + Step 4 returns no `rating` key.
- Remove `rating` (frontend type) → Task 2.
- Frontend component unchanged → confirmed, no task needed (reads `id`/`name`/`rate` only).
- All edge cases from the spec table are covered by a test or by the `isset()`/`?? []` guards in Step 4.

**Placeholder scan:** No TBD/TODO; every code and command step is concrete.

**Type consistency:** `bookChapterCount`, `totalChapters`, `taught`, `rate` used consistently within Step 4. Test model fields (`class_id`, `module_id`, `book_id`, `chapter_index`, `teacher_id`, `date`, `chapters`, `position`) match the schema confirmed in the migrations and existing `DashboardTest.php`.

**Note:** Task 0 (PHP/Composer install) is a hard prerequisite for running backend tests. If the user cannot install locally, Tasks 1's code + tests are still authored and committed; verification would then have to happen in CI or the deployed environment.
