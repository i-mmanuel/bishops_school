'use client'
import { useState, useCallback } from 'react'
import AdminShell from '@/components/layout/AdminShell'
import { getTeachers, getClasses, addTeacher, updateTeacher, deleteTeacher } from '@/lib/mock-data'
import type { Teacher } from '@/lib/types'

function useTeachers() {
  const [, forceUpdate] = useState(0)
  const refresh = useCallback(() => forceUpdate(n => n + 1), [])
  return { teachers: getTeachers(), refresh }
}

export default function AdminTeachersPage() {
  const { teachers, refresh } = useTeachers()

  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const inputClass = "rounded-lg px-3 py-1.5 text-sm text-on-surface outline-none border border-white/[0.08] focus:border-primary/40 focus:ring-1 focus:ring-primary/20 font-label"
  const inputStyle = { background: 'rgba(255,255,255,0.04)' }

  function handleCreate() {
    if (!newName.trim()) return
    addTeacher(newName.trim())
    setNewName('')
    setShowCreate(false)
    refresh()
  }

  function startEdit(t: Teacher) {
    setShowCreate(false)
    setEditingId(t.id)
    setEditName(t.name)
  }

  function handleSaveEdit() {
    if (!editingId || !editName.trim()) return
    updateTeacher(editingId, { name: editName.trim() })
    setEditingId(null)
    refresh()
  }

  function handleDelete(id: string) {
    const assignedCount = getClasses().filter(c => c.teacherId === id).length
    const msg = assignedCount > 0
      ? `This teacher is assigned to ${assignedCount} class(es). Delete anyway?`
      : 'Delete this teacher?'
    if (!window.confirm(msg)) return
    deleteTeacher(id)
    refresh()
  }

  return (
    <AdminShell>
      <div className="p-6 md:p-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-headline font-bold text-on-surface">Teachers</h1>
          <button
            onClick={() => { setShowCreate(v => !v); setEditingId(null) }}
            className="px-4 py-2 rounded-lg text-sm font-label font-semibold bg-primary/20 text-primary-dim border border-primary/30 hover:bg-primary/30 transition-colors"
          >
            {showCreate ? 'Cancel' : '+ New Teacher'}
          </button>
        </div>

        {/* Create form */}
        {showCreate && (
          <div
            className="mb-6 p-4 rounded-xl border border-white/[0.08] flex flex-wrap gap-3 items-end"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-wider font-label text-on-surface-variant/50">Name</label>
              <input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="e.g. Pastor John Doe"
                className={inputClass}
                style={inputStyle}
              />
            </div>
            <button
              onClick={handleCreate}
              disabled={!newName.trim()}
              className="px-4 py-1.5 rounded-lg text-sm font-label font-semibold bg-primary/20 text-primary-dim border border-primary/30 hover:bg-primary/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Create
            </button>
          </div>
        )}

        {/* Table */}
        <div
          className="rounded-xl border border-white/[0.08] overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.025)' }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider font-label text-on-surface-variant/50">Name</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {teachers.map(t => (
                <tr key={t.id} className="border-b border-white/[0.04] last:border-0">
                  <td className="px-4 py-3">
                    {editingId === t.id ? (
                      <input
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className={inputClass}
                        style={inputStyle}
                      />
                    ) : (
                      <span className="font-medium text-on-surface">{t.name}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      {editingId === t.id ? (
                        <>
                          <button
                            onClick={handleSaveEdit}
                            disabled={!editName.trim()}
                            className="px-3 py-1 rounded-lg text-xs font-label font-semibold bg-primary/20 text-primary-dim border border-primary/30 hover:bg-primary/30 disabled:opacity-40 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1 rounded-lg text-xs font-label text-on-surface-variant/60 border border-white/[0.08] hover:bg-surface/[0.04] transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(t)}
                            className="px-3 py-1 rounded-lg text-xs font-label text-on-surface-variant/60 border border-white/[0.08] hover:bg-surface/[0.04] hover:text-on-surface transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="px-3 py-1 rounded-lg text-xs font-label text-tertiary/60 border border-tertiary/20 hover:bg-tertiary/10 hover:text-tertiary transition-colors"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {teachers.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-4 py-8 text-center text-on-surface-variant/40 font-label">
                    No teachers yet. Add one above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  )
}
