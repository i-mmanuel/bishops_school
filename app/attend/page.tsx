'use client'
import { useState, useMemo } from 'react'
import {
  getTeachers, getClassesForTeacher, getStudentsByClass,
  getClassById, getModules, getModuleById, submitSession
} from '@/lib/mock-data'
import type { Student } from '@/lib/types'
import StudentToggleList from '@/components/attend/StudentToggleList'
import SuccessScreen from '@/components/attend/SuccessScreen'

const selectStyle = {
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
}

export default function AttendPage() {
  const teachers = getTeachers()
  const allModules = getModules()

  const [teacherId, setTeacherId] = useState('')
  const [classId, setClassId] = useState('')
  const [moduleId, setModuleId] = useState('')
  const [bookId, setBookId] = useState('')
  const [chapterIndex, setChapterIndex] = useState<number | ''>('')
  const [statuses, setStatuses] = useState<Record<string, 'present' | 'absent'>>({})
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submittedClassName, setSubmittedClassName] = useState('')

  const teacherClasses = useMemo(() => {
    if (!teacherId) return []
    return getClassesForTeacher(teacherId)
  }, [teacherId])

  const moduleBooks = useMemo(() => {
    if (!moduleId) return []
    return getModuleById(moduleId)?.books ?? []
  }, [moduleId])

  const bookChapters = useMemo(() => {
    if (!bookId || moduleBooks.length === 0) return []
    return moduleBooks.find(b => b.id === bookId)?.chapters ?? []
  }, [bookId, moduleBooks])

  const students: Student[] = useMemo(() => {
    if (!classId) return []
    return getStudentsByClass(classId)
  }, [classId])

  function handleTeacherChange(id: string) {
    setTeacherId(id)
    setModuleId('')
    setBookId('')
    setChapterIndex('')
    setStatuses({})
    setError('')
    const classes = getClassesForTeacher(id)
    if (classes.length === 1) {
      const cls = classes[0]
      setClassId(cls.id)
      const s = getStudentsByClass(cls.id)
      setStatuses(Object.fromEntries(s.map(st => [st.id, 'present'])))
    } else {
      setClassId('')
    }
  }

  function handleClassChange(id: string) {
    setClassId(id); setModuleId(''); setBookId(''); setChapterIndex(''); setError('')
    const s = getStudentsByClass(id)
    setStatuses(Object.fromEntries(s.map(st => [st.id, 'present'])))
  }

  function handleBookChange(id: string) {
    setBookId(id)
    setChapterIndex('')
    setError('')
  }

  function toggleStudent(studentId: string) {
    setStatuses(prev => ({ ...prev, [studentId]: prev[studentId] === 'present' ? 'absent' : 'present' }))
  }

  function handleSubmit() {
    if (!teacherId || !classId || !moduleId || !bookId || chapterIndex === '') return
    const today = new Date().toISOString().split('T')[0]
    const classTeacherId = getClassById(classId)?.teacherId ?? teacherId
    const result = submitSession({
      classId, moduleId, teacherId: classTeacherId, date: today,
      bookId, chapterIndex: chapterIndex as number,
      records: students.map(s => ({ studentId: s.id, status: statuses[s.id] ?? 'present' })),
    })
    if (!result.success) { setError(result.error ?? 'Submission failed.'); return }
    const cls = getClassById(classId)
    setSubmittedClassName(cls?.name ?? '')
    setSubmitted(true)
  }

  function handleSubmitAnother() {
    setClassId(''); setModuleId(''); setBookId(''); setChapterIndex(''); setStatuses({}); setError(''); setSubmitted(false); setSubmittedClassName('')
  }

  const teacher = teachers.find(t => t.id === teacherId)

  if (submitted) {
    return <SuccessScreen teacherName={teacher?.name ?? ''} courseName={submittedClassName} onSubmitAnother={handleSubmitAnother} />
  }

  const presentCount = Object.values(statuses).filter(s => s === 'present').length
  const absentCount = Object.values(statuses).filter(s => s === 'absent').length

  const selectClass = "border border-white/[0.08] rounded-xl px-4 py-3 text-sm font-label text-on-surface outline-none focus:border-primary/40 transition-all duration-200 appearance-none disabled:opacity-40 disabled:cursor-not-allowed"

  return (
    <div className="min-h-[100dvh] px-4 py-8 max-w-lg mx-auto">
      <div className="mb-8">
        <p className="text-xs font-label text-on-surface-variant/60 uppercase tracking-widest mb-1">School Attendance</p>
        <h1 className="text-2xl font-headline font-bold text-on-surface tracking-tight">Mark Attendance</h1>
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
            <option key={cls.id} value={cls.id}>{cls.name} Class</option>
          ))}
        </select>
      </div>

      {/* Module selector */}
      <div className="flex flex-col gap-1.5 mb-4">
        <label className="text-xs font-label text-on-surface-variant/60 uppercase tracking-wider">Module</label>
        <select value={moduleId} onChange={e => { setModuleId(e.target.value); setBookId(''); setChapterIndex(''); setError('') }}
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

      {/* Chapter selector */}
      <div className="flex flex-col gap-1.5 mb-6">
        <label className="text-xs font-label text-on-surface-variant/60 uppercase tracking-wider">Chapter</label>
        <select value={chapterIndex} onChange={e => { setChapterIndex(e.target.value === '' ? '' : Number(e.target.value)); setError('') }}
          disabled={!bookId || bookChapters.length === 0} className={selectClass} style={selectStyle}>
          <option value="">Select chapter…</option>
          {bookChapters.map((chapter, i) => <option key={i} value={i}>{chapter}</option>)}
        </select>
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
          disabled={chapterIndex === '' || !bookId}
          className="mt-6 w-full py-4 rounded-xl font-label font-semibold text-sm text-white hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: '0 0 24px rgba(124,58,237,0.35)' }}
        >
          Submit Session
        </button>
      )}
    </div>
  )
}
