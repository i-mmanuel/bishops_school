'use client'
import { useState, useEffect } from 'react'
import AdminShell from '@/components/layout/AdminShell'
import { api } from '@/lib/api'
import type { ApiStudent, ApiSchoolClass, ApiChurch } from '@/lib/api-types'

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<ApiStudent[]>([])
  const [classes, setClasses] = useState<ApiSchoolClass[]>([])
  const [churches, setChurches] = useState<ApiChurch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newClassId, setNewClassId] = useState<number | null>(null)
  const [newChurchId, setNewChurchId] = useState<number | null>(null)
  const [newGender, setNewGender] = useState<'male' | 'female' | ''>('')
  const [newCountry, setNewCountry] = useState('')

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [editClassId, setEditClassId] = useState<number | null>(null)
  const [editChurchId, setEditChurchId] = useState<number | null>(null)
  const [editGender, setEditGender] = useState<'male' | 'female' | ''>('')
  const [editCountry, setEditCountry] = useState('')

  const inputClass = "rounded-lg px-3 py-2 text-sm text-on-surface outline-none border border-white/[0.08] focus:border-primary/40 focus:ring-1 focus:ring-primary/20 font-label w-full"
  const inputStyle = { background: 'rgba(255,255,255,0.04)' }
  const selectClass = inputClass + " cursor-pointer"

  useEffect(() => {
    Promise.all([api.listStudents(), api.listClasses(), api.listChurches()])
      .then(([st, cls, ch]) => { setStudents(st); setClasses(cls); setChurches(ch) })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [])

  async function handleCreate() {
    if (!newName.trim() || !newClassId) return
    try {
      const student = await api.createStudent({
        name: newName.trim(),
        class_id: newClassId,
        church_id: newChurchId ?? undefined,
        gender: newGender || undefined,
        country: newCountry.trim() || undefined,
      })
      setStudents(prev => [...prev, student])
      setNewName(''); setNewClassId(null); setNewChurchId(null); setNewGender(''); setNewCountry('')
      setShowCreate(false)
    } catch (e) {
      setError(String(e))
    }
  }

  function startEdit(s: ApiStudent) {
    setShowCreate(false)
    setEditingId(s.id)
    setEditName(s.name)
    setEditClassId(s.class_id)
    setEditChurchId(s.church_id)
    setEditGender(s.gender ?? '')
    setEditCountry(s.country ?? '')
  }

  async function handleSaveEdit() {
    if (!editingId || !editName.trim() || !editClassId) return
    try {
      const updated = await api.updateStudent(editingId, {
        name: editName.trim(),
        class_id: editClassId,
        church_id: editChurchId ?? undefined,
        gender: editGender || undefined,
        country: editCountry.trim() || undefined,
      })
      setStudents(prev => prev.map(s => s.id === editingId ? updated : s))
      setEditingId(null)
    } catch (e) {
      setError(String(e))
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Delete this student?')) return
    try {
      await api.deleteStudent(id)
      setStudents(prev => prev.filter(s => s.id !== id))
    } catch (e) {
      setError(String(e))
    }
  }

  const className = (id: number | null) => classes.find(c => c.id === id)?.name ?? 'Unassigned'
  const churchName = (id: number | null) => churches.find(c => c.id === id)?.name ?? 'Unassigned'

  return (
    <AdminShell>
      <div className="px-4 py-6 md:p-8 max-w-5xl mx-auto pb-24 md:pb-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-headline font-bold text-on-surface">Students</h1>
          <button
            onClick={() => { setShowCreate(v => !v); setEditingId(null) }}
            className="px-4 py-2 rounded-lg text-sm font-label font-semibold bg-primary/20 text-primary-dim border border-primary/30 hover:bg-primary/30 transition-colors"
          >
            {showCreate ? 'Cancel' : '+ New Student'}
          </button>
        </div>

        {error && <p className="mb-4 text-sm font-label text-tertiary-dim">{error}</p>}

        {/* Create form */}
        {showCreate && (
          <div
            className="mb-6 p-4 rounded-xl border border-white/[0.08] flex flex-col md:flex-row md:flex-wrap gap-3 md:items-end"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <label className="text-[10px] uppercase tracking-wider font-label text-on-surface-variant/50">Name</label>
              <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Full name" className={inputClass} style={inputStyle} />
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <label className="text-[10px] uppercase tracking-wider font-label text-on-surface-variant/50">Class</label>
              <select
                value={newClassId ?? ''}
                onChange={e => setNewClassId(e.target.value === '' ? null : Number(e.target.value))}
                className={selectClass}
                style={inputStyle}
              >
                <option value="">Select class…</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <label className="text-[10px] uppercase tracking-wider font-label text-on-surface-variant/50">Church</label>
              <select
                value={newChurchId ?? ''}
                onChange={e => setNewChurchId(e.target.value === '' ? null : Number(e.target.value))}
                className={selectClass}
                style={inputStyle}
              >
                <option value="">Unassigned</option>
                {churches.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <label className="text-[10px] uppercase tracking-wider font-label text-on-surface-variant/50">Gender</label>
              <select value={newGender} onChange={e => setNewGender(e.target.value as 'male' | 'female' | '')} className={selectClass} style={inputStyle}>
                <option value="">Select…</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <label className="text-[10px] uppercase tracking-wider font-label text-on-surface-variant/50">Country</label>
              <input value={newCountry} onChange={e => setNewCountry(e.target.value)} placeholder="e.g. Nigeria" className={inputClass} style={inputStyle} />
            </div>
            <button
              onClick={handleCreate}
              disabled={!newName.trim() || !newClassId}
              className="w-full md:w-auto px-4 py-2 rounded-lg text-sm font-label font-semibold bg-primary/20 text-primary-dim border border-primary/30 hover:bg-primary/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Create
            </button>
          </div>
        )}

        {loading ? (
          <p className="px-4 py-8 text-center text-on-surface-variant/40 font-label">Loading…</p>
        ) : (
          <>
            {/* Mobile: card list */}
            <div className="md:hidden space-y-3">
              {students.map(s => (
                <div
                  key={s.id}
                  className="p-4 rounded-xl border border-white/[0.08]"
                  style={{ background: 'rgba(255,255,255,0.025)' }}
                >
                  {editingId === s.id ? (
                    <div className="space-y-3">
                      <input value={editName} onChange={e => setEditName(e.target.value)} className={inputClass} style={inputStyle} />
                      <select
                        value={editClassId ?? ''}
                        onChange={e => setEditClassId(e.target.value === '' ? null : Number(e.target.value))}
                        className={selectClass}
                        style={inputStyle}
                      >
                        <option value="">Select class…</option>
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                      <select
                        value={editChurchId ?? ''}
                        onChange={e => setEditChurchId(e.target.value === '' ? null : Number(e.target.value))}
                        className={selectClass}
                        style={inputStyle}
                      >
                        <option value="">Unassigned</option>
                        {churches.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                      <select value={editGender} onChange={e => setEditGender(e.target.value as 'male' | 'female' | '')} className={selectClass} style={inputStyle}>
                        <option value="">Select gender…</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                      <input value={editCountry} onChange={e => setEditCountry(e.target.value)} placeholder="e.g. Nigeria" className={inputClass} style={inputStyle} />
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveEdit}
                          disabled={!editName.trim() || !editClassId}
                          className="flex-1 px-3 py-2 rounded-lg text-xs font-label font-semibold bg-primary/20 text-primary-dim border border-primary/30 hover:bg-primary/30 disabled:opacity-40 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="flex-1 px-3 py-2 rounded-lg text-xs font-label text-on-surface-variant/60 border border-white/[0.08] hover:bg-white/5 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="font-semibold text-on-surface">{s.name}</p>
                      <p className="text-xs text-on-surface-variant/60 font-label mt-0.5">{className(s.class_id)}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {s.country && (
                          <span className="text-[10px] font-label text-on-surface-variant/60 bg-white/5 border border-white/[0.06] px-2 py-0.5 rounded-full">
                            {s.country}
                          </span>
                        )}
                        {s.gender && (
                          <span className="text-[10px] font-label text-on-surface-variant/60 bg-white/5 border border-white/[0.06] px-2 py-0.5 rounded-full capitalize">
                            {s.gender}
                          </span>
                        )}
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => startEdit(s)}
                          className="flex-1 px-3 py-2 rounded-lg text-xs font-label text-on-surface-variant/70 border border-white/[0.08] hover:bg-white/5 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="flex-1 px-3 py-2 rounded-lg text-xs font-label text-tertiary/70 border border-tertiary/20 hover:bg-tertiary/10 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
              {students.length === 0 && (
                <p className="text-center text-on-surface-variant/50 py-8 text-sm font-label">No students yet. Add one above.</p>
              )}
            </div>

            {/* Desktop: table */}
            <div
              className="hidden md:block rounded-xl border border-white/[0.08] overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.025)' }}
            >
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider font-label text-on-surface-variant/50">Name</th>
                    <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider font-label text-on-surface-variant/50">Class</th>
                    <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider font-label text-on-surface-variant/50">Church</th>
                    <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider font-label text-on-surface-variant/50">Gender</th>
                    <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider font-label text-on-surface-variant/50">Country</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s.id} className="border-b border-white/[0.04] last:border-0">
                      <td className="px-4 py-3">
                        {editingId === s.id ? (
                          <input value={editName} onChange={e => setEditName(e.target.value)} className={inputClass} style={inputStyle} />
                        ) : (
                          <span className="font-medium text-on-surface">{s.name}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {editingId === s.id ? (
                          <select
                            value={editClassId ?? ''}
                            onChange={e => setEditClassId(e.target.value === '' ? null : Number(e.target.value))}
                            className={selectClass}
                            style={inputStyle}
                          >
                            <option value="">Select class…</option>
                            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                        ) : (
                          <span className={`font-label ${s.class_id ? 'text-on-surface-variant/70' : 'text-on-surface-variant/35 italic'}`}>{className(s.class_id)}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {editingId === s.id ? (
                          <select
                            value={editChurchId ?? ''}
                            onChange={e => setEditChurchId(e.target.value === '' ? null : Number(e.target.value))}
                            className={selectClass}
                            style={inputStyle}
                          >
                            <option value="">Unassigned</option>
                            {churches.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                        ) : (
                          <span className={`font-label ${s.church_id ? 'text-on-surface-variant/70' : 'text-on-surface-variant/35 italic'}`}>{churchName(s.church_id)}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {editingId === s.id ? (
                          <select value={editGender} onChange={e => setEditGender(e.target.value as 'male' | 'female' | '')} className={selectClass} style={inputStyle}>
                            <option value="">Select…</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </select>
                        ) : (
                          <span className="text-on-surface-variant/60 font-label capitalize">{s.gender ?? '—'}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {editingId === s.id ? (
                          <input value={editCountry} onChange={e => setEditCountry(e.target.value)} placeholder="e.g. Nigeria" className={inputClass} style={inputStyle} />
                        ) : (
                          <span className={`font-label ${s.country ? 'text-on-surface-variant/70' : 'text-on-surface-variant/35 italic'}`}>{s.country ?? '—'}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          {editingId === s.id ? (
                            <>
                              <button
                                onClick={handleSaveEdit}
                                disabled={!editName.trim() || !editClassId}
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
                                onClick={() => startEdit(s)}
                                className="px-3 py-1 rounded-lg text-xs font-label text-on-surface-variant/60 border border-white/[0.08] hover:bg-surface/[0.04] hover:text-on-surface transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(s.id)}
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
                  {students.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-on-surface-variant/40 font-label">
                        No students yet. Add one above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </AdminShell>
  )
}
