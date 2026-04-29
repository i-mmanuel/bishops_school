'use client'
import { useState, useEffect, useMemo } from 'react'
import { api } from '@/lib/api'
import type { ApiModule, ApiSchoolClass, ApiStudent, ApiTeacher } from '@/lib/api-types'
import StudentToggleList from '@/components/attend/StudentToggleList'
import SuccessScreen from '@/components/attend/SuccessScreen'

const selectStyle = {
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
}

const selectClass = 'border border-white/[0.08] rounded-xl px-4 py-3 text-sm font-label text-on-surface outline-none focus:border-primary/40 transition-all duration-200 appearance-none disabled:opacity-40 disabled:cursor-not-allowed'

export default function AttendPage() {
  const [teachers, setTeachers] = useState<ApiTeacher[]>([])
  const [allClasses, setAllClasses] = useState<ApiSchoolClass[]>([])
  const [allModules, setAllModules] = useState<ApiModule[]>([])
  const [loadingBootstrap, setLoadingBootstrap] = useState(true)
  const [bootstrapError, setBootstrapError] = useState('')

  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [teacherId, setTeacherId] = useState<number | ''>('')
  const [classId, setClassId] = useState<number | ''>('')
  const [moduleId, setModuleId] = useState<number | ''>('')
  const [bookId, setBookId] = useState<number | ''>('')
  const [chapterIndices, setChapterIndices] = useState<number[]>([])

  const [students, setStudents] = useState<ApiStudent[]>([])
  const [statuses, setStatuses] = useState<Record<number, 'present' | 'absent'>>({})
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submittedClassName, setSubmittedClassName] = useState('')

  // Bootstrap: fetch teachers, classes, modules on mount.
  useEffect(() => {
    let cancelled = false
    Promise.all([api.listTeachers(), api.listClasses(), api.listModules()])
      .then(([t, c, m]) => {
        if (cancelled) return
        setTeachers(t)
        setAllClasses(c)
        setAllModules(m)
        setLoadingBootstrap(false)
      })
      .catch(err => {
        if (cancelled) return
        setBootstrapError(err.message ?? 'Failed to load data')
        setLoadingBootstrap(false)
      })
    return () => { cancelled = true }
  }, [])

  // Fetch students when class changes.
  useEffect(() => {
    if (!classId) {
      setStudents([])
      setStatuses({})
      return
    }
    let cancelled = false
    api.listStudents({ class_id: Number(classId) })
      .then(list => {
        if (cancelled) return
        setStudents(list)
        setStatuses(Object.fromEntries(list.map(s => [s.id, 'present'])))
      })
      .catch(err => {
        if (cancelled) return
        setError(err.message ?? 'Failed to load students')
      })
    return () => { cancelled = true }
  }, [classId])

  const teacherClasses = useMemo(() => {
    if (!teacherId) return []
    return allClasses.filter(c => c.teacher_id === Number(teacherId))
  }, [teacherId, allClasses])

  const selectedModule = useMemo(() => {
    if (!moduleId) return undefined
    return allModules.find(m => m.id === Number(moduleId))
  }, [moduleId, allModules])

  const moduleBooks = useMemo(() => selectedModule?.books ?? [], [selectedModule])

  const selectedBook = useMemo(() => {
    if (!bookId) return undefined
    return moduleBooks.find(b => b.id === Number(bookId))
  }, [bookId, moduleBooks])

  const bookChapters = useMemo(() => selectedBook?.chapters ?? [], [selectedBook])

  function handleTeacherChange(id: string) {
    const num = id === '' ? '' : Number(id)
    setTeacherId(num)
    setClassId('')
    setModuleId('')
    setBookId('')
    setChapterIndices([])
    setError('')
    if (num !== '') {
      const classes = allClasses.filter(c => c.teacher_id === num)
      if (classes.length === 1) {
        setClassId(classes[0].id)
      }
    }
  }

  function handleClassChange(id: string) {
    const num = id === '' ? '' : Number(id)
    setClassId(num)
    setModuleId('')
    setBookId('')
    setChapterIndices([])
    setError('')
  }

  function handleModuleChange(id: string) {
    setModuleId(id === '' ? '' : Number(id))
    setBookId('')
    setChapterIndices([])
    setError('')
  }

  function handleBookChange(id: string) {
    setBookId(id === '' ? '' : Number(id))
    setChapterIndices([])
    setError('')
  }

  function toggleStudent(studentId: number) {
    setStatuses(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'present' ? 'absent' : 'present',
    }))
  }

  function toggleChapter(index: number) {
    setChapterIndices(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index].sort((a, b) => a - b)
    )
    setError('')
  }

  async function handleSubmit() {
    if (!teacherId || !classId || !moduleId || !bookId || chapterIndices.length === 0) return
    setSubmitting(true)
    setError('')
    try {
      await api.createSession({
        class_id: Number(classId),
        module_id: Number(moduleId),
        teacher_id: Number(teacherId),
        date,
        book_id: Number(bookId),
        chapter_indices: chapterIndices,
        attendance: students.map(s => ({
          student_id: s.id,
          status: statuses[s.id] ?? 'present',
        })),
      })
      const cls = allClasses.find(c => c.id === Number(classId))
      setSubmittedClassName(cls?.name ?? '')
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleSubmitAnother() {
    setClassId('')
    setModuleId('')
    setBookId('')
    setChapterIndices([])
    setStatuses({})
    setStudents([])
    setError('')
    setSubmitted(false)
    setSubmittedClassName('')
  }

  const teacher = teachers.find(t => t.id === Number(teacherId))

  if (submitted) {
    return (
      <SuccessScreen
        teacherName={teacher?.name ?? ''}
        courseName={submittedClassName}
        onSubmitAnother={handleSubmitAnother}
      />
    )
  }

  if (loadingBootstrap) {
    return (
      <div className="min-h-[100dvh] px-4 py-8 max-w-lg mx-auto">
        <p className="text-sm font-label text-on-surface-variant/60">Loading…</p>
      </div>
    )
  }

  if (bootstrapError) {
    return (
      <div className="min-h-[100dvh] px-4 py-8 max-w-lg mx-auto">
        <p className="text-sm font-label text-tertiary-dim">Error: {bootstrapError}</p>
      </div>
    )
  }

  const presentCount = Object.values(statuses).filter(s => s === 'present').length
  const absentCount = Object.values(statuses).filter(s => s === 'absent').length

  return (
    <div className="min-h-[100dvh] px-4 py-8 max-w-lg mx-auto">
      <div className="mb-8">
        <p className="text-xs font-label text-on-surface-variant/60 uppercase tracking-widest mb-1">School Attendance</p>
        <h1 className="text-2xl font-headline font-bold text-on-surface tracking-tight">Mark Attendance</h1>
      </div>

      {/* Date selector */}
      <div className="flex flex-col gap-1.5 mb-4">
        <label className="text-xs font-label text-on-surface-variant/60 uppercase tracking-wider">Date</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className={selectClass}
          style={{ ...selectStyle, colorScheme: 'dark' }}
        />
      </div>

      {/* Teacher selector */}
      <div className="flex flex-col gap-1.5 mb-4">
        <label className="text-xs font-label text-on-surface-variant/60 uppercase tracking-wider">Teacher</label>
        <select value={teacherId} onChange={e => handleTeacherChange(e.target.value)}
          className={selectClass} style={selectStyle}>
          <option value="">Select instructor…</option>
          {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      {/* Class selector */}
      <div className="flex flex-col gap-1.5 mb-4">
        <label className="text-xs font-label text-on-surface-variant/60 uppercase tracking-wider">Class</label>
        <select value={classId} onChange={e => handleClassChange(e.target.value)}
          disabled={!teacherId} className={selectClass} style={selectStyle}>
          <option value="">Select class…</option>
          {teacherClasses.map(cls => (
            <option key={cls.id} value={cls.id}>{cls.name}</option>
          ))}
        </select>
      </div>

      {/* Module selector */}
      <div className="flex flex-col gap-1.5 mb-4">
        <label className="text-xs font-label text-on-surface-variant/60 uppercase tracking-wider">Module</label>
        <select value={moduleId} onChange={e => handleModuleChange(e.target.value)}
          disabled={!classId} className={selectClass} style={selectStyle}>
          <option value="">Select module…</option>
          {allModules.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </div>

      {/* Book selector */}
      <div className="flex flex-col gap-1.5 mb-4">
        <label className="text-xs font-label text-on-surface-variant/60 uppercase tracking-wider">Book</label>
        <select value={bookId} onChange={e => handleBookChange(e.target.value)}
          disabled={!moduleId} className={selectClass} style={selectStyle}>
          <option value="">Select book…</option>
          {moduleBooks.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>

      {/* Chapter selector (multi-select) */}
      <div className="flex flex-col gap-1.5 mb-6">
        <label className="text-xs font-label text-on-surface-variant/60 uppercase tracking-wider">
          Chapters {chapterIndices.length > 0 && <span className="text-on-surface-variant/40 normal-case tracking-normal">· {chapterIndices.length} selected</span>}
        </label>
        {!bookId || bookChapters.length === 0 ? (
          <div className={`${selectClass} text-on-surface-variant/40`} style={selectStyle}>
            Select a book first…
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {bookChapters.map((chapter, i) => {
              const checked = chapterIndices.includes(i)
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleChapter(i)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-label text-left transition-all duration-200 active:scale-[0.99] ${
                    checked
                      ? 'border-primary/40 bg-primary/[0.08] text-on-surface'
                      : 'border-white/[0.08] text-on-surface hover:border-white/[0.16]'
                  }`}
                  style={selectStyle}
                >
                  <span
                    className={`flex items-center justify-center w-5 h-5 rounded border transition-all ${
                      checked ? 'border-primary bg-primary text-white' : 'border-white/[0.24]'
                    }`}
                  >
                    {checked && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6.5L4.75 8.75L9.5 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <span className="flex-1">{chapter}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Student list */}
      {students.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-headline font-bold text-on-surface">Students</h2>
            <div className="flex gap-3 text-xs font-label">
              <span className="text-secondary-dim">{presentCount} present</span>
              <span className="text-tertiary-dim">{absentCount} absent</span>
            </div>
          </div>
          <StudentToggleList students={students} statuses={statuses} onToggle={toggleStudent} />
        </>
      )}

      {error && <p className="mt-4 text-sm font-label text-tertiary-dim">{error}</p>}

      {students.length > 0 && (
        <button
          onClick={handleSubmit}
          disabled={chapterIndices.length === 0 || !bookId || submitting}
          className="mt-6 w-full py-4 rounded-xl font-label font-semibold text-sm text-white hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: '0 0 24px rgba(124,58,237,0.35)' }}
        >
          {submitting ? 'Submitting…' : 'Submit Session'}
        </button>
      )}
    </div>
  )
}
