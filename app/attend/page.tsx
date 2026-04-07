'use client'
import { useState, useMemo } from 'react'
import { getTeachers, getTeacherModuleAssignments, getStudentsByClass, getModuleById, getClassById, submitSession } from '@/lib/mock-data'
import type { Student } from '@/lib/types'
import StudentToggleList from '@/components/attend/StudentToggleList'
import SuccessScreen from '@/components/attend/SuccessScreen'

export default function AttendPage() {
  const teachers = getTeachers()
  const allAssignments = getTeacherModuleAssignments()

  const [teacherId, setTeacherId] = useState('')
  const [assignmentId, setAssignmentId] = useState('')
  const [statuses, setStatuses] = useState<Record<string, 'present' | 'absent'>>({})
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submittedModuleName, setSubmittedModuleName] = useState('')

  const teacherAssignments = useMemo(
    () => (teacherId ? allAssignments.filter(a => a.teacherId === teacherId) : []),
    [teacherId, allAssignments]
  )

  const selectedAssignment = teacherAssignments.find(a => a.id === assignmentId)

  const students: Student[] = useMemo(() => {
    if (!selectedAssignment) return []
    return getStudentsByClass(selectedAssignment.classId)
  }, [selectedAssignment])

  function handleTeacherChange(id: string) {
    setTeacherId(id)
    setAssignmentId('')
    setStatuses({})
    setError('')
  }

  function handleAssignmentChange(id: string) {
    setAssignmentId(id)
    setError('')
    const assignment = teacherAssignments.find(a => a.id === id)
    if (assignment) {
      const s = getStudentsByClass(assignment.classId)
      setStatuses(Object.fromEntries(s.map(st => [st.id, 'present'])))
    }
  }

  function toggleStudent(studentId: string) {
    setStatuses(prev => ({ ...prev, [studentId]: prev[studentId] === 'present' ? 'absent' : 'present' }))
  }

  function handleSubmit() {
    if (!teacherId || !selectedAssignment) return
    const today = new Date().toISOString().split('T')[0]
    const result = submitSession({
      classId: selectedAssignment.classId,
      moduleId: selectedAssignment.moduleId,
      teacherId,
      date: today,
      records: students.map(s => ({ studentId: s.id, status: statuses[s.id] ?? 'present' })),
    })
    if (!result.success) { setError(result.error ?? 'Submission failed.'); return }
    const mod = getModuleById(selectedAssignment.moduleId)
    setSubmittedModuleName(mod?.name ?? '')
    setSubmitted(true)
  }

  function handleSubmitAnother() {
    setAssignmentId('')
    setStatuses({})
    setError('')
    setSubmitted(false)
    setSubmittedModuleName('')
  }

  const teacher = teachers.find(t => t.id === teacherId)

  if (submitted) {
    return <SuccessScreen teacherName={teacher?.name ?? ''} courseName={submittedModuleName} onSubmitAnother={handleSubmitAnother} />
  }

  const presentCount = Object.values(statuses).filter(s => s === 'present').length
  const absentCount = Object.values(statuses).filter(s => s === 'absent').length

  return (
    <div className="min-h-[100dvh] px-4 py-8 max-w-lg mx-auto">
      <div className="mb-8">
        <p className="text-xs font-label text-on-surface-variant uppercase tracking-widest mb-1">School Attendance</p>
        <h1 className="text-2xl font-headline font-bold text-on-surface tracking-tight">Mark Attendance</h1>
      </div>

      {/* Teacher selector */}
      <div className="flex flex-col gap-1.5 mb-4">
        <label className="text-xs font-label text-on-surface-variant uppercase tracking-wider">Teacher</label>
        <select
          value={teacherId}
          onChange={e => handleTeacherChange(e.target.value)}
          className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-3 text-sm font-label text-on-surface outline-none focus:border-primary transition-all duration-200 appearance-none"
        >
          <option value="">Select teacher…</option>
          {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      {/* Class + Module selector */}
      <div className="flex flex-col gap-1.5 mb-6">
        <label className="text-xs font-label text-on-surface-variant uppercase tracking-wider">Class &amp; Module</label>
        <select
          value={assignmentId}
          onChange={e => handleAssignmentChange(e.target.value)}
          disabled={!teacherId}
          className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-3 text-sm font-label text-on-surface outline-none focus:border-primary transition-all duration-200 appearance-none disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <option value="">Select class &amp; module…</option>
          {teacherAssignments.map(a => {
            const cls = getClassById(a.classId)
            const mod = getModuleById(a.moduleId)
            return <option key={a.id} value={a.id}>{cls?.name} — {mod?.name}</option>
          })}
        </select>
      </div>

      {/* Student list */}
      {students.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-headline font-bold text-on-surface">Students</h2>
            <div className="flex gap-3 text-xs font-label">
              <span className="text-secondary">{presentCount} present</span>
              <span className="text-tertiary">{absentCount} absent</span>
            </div>
          </div>
          <StudentToggleList students={students} statuses={statuses} onToggle={toggleStudent} />
        </>
      )}

      {error && <p className="mt-4 text-sm font-label text-tertiary">{error}</p>}

      {students.length > 0 && (
        <button
          onClick={handleSubmit}
          className="mt-6 w-full py-4 rounded-xl font-label font-semibold text-sm text-on-primary bg-gradient-to-br from-primary to-primary-container hover:opacity-90 active:scale-[0.98] transition-all duration-200"
        >
          Submit Session
        </button>
      )}
    </div>
  )
}
