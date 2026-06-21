import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import Spinner from '@/components/ui/Spinner'
import { hrConfigService } from '@/services/employeeService'
import toast from 'react-hot-toast'

const TABS = ['Employment Types','Shift Policies','Grade & Band','HR Policies']
const POLICY_COLORS = { Leave:'bg-emerald-100 text-emerald-700', Attendance:'bg-blue-100 text-blue-700', Conduct:'bg-violet-100 text-violet-700', Expense:'bg-amber-100 text-amber-700', Security:'bg-red-100 text-red-700', Performance:'bg-pink-100 text-pink-700', Other:'bg-slate-100 text-slate-600' }

function Toggle2({ on, onClick }) {
  return (
    <div onClick={onClick} className={`w-8 h-4 rounded-full transition-colors cursor-pointer ${on ? 'bg-primary' : 'bg-slate-200'} relative`}>
      <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all ${on ? 'left-4' : 'left-0.5'}`}/>
    </div>
  )
}

// Field configs per tab
const FORM_FIELDS = {
  'Employment Types': [
    { name:'name', label:'Type Name', placeholder:'e.g. Full-Time' },
    { name:'code', label:'Code',      placeholder:'e.g. FT' },
    { name:'noticeDays',    label:'Notice Period (days)',   type:'number', placeholder:'60' },
    { name:'probationDays', label:'Probation Period (days)',type:'number', placeholder:'90' },
  ],
  'Shift Policies': [
    { name:'name', label:'Shift Name', placeholder:'e.g. General Shift' },
    { name:'code', label:'Code',       placeholder:'e.g. GS' },
    { name:'startTime', label:'Start Time', type:'time' },
    { name:'endTime',   label:'End Time',   type:'time' },
    { name:'breakMinutes', label:'Break (minutes)', type:'number', placeholder:'60' },
    { name:'workDays', label:'Working Days', placeholder:'e.g. Mon–Fri' },
  ],
  'Grade & Band': [
    { name:'grade', label:'Grade', placeholder:'e.g. L4' },
    { name:'band',  label:'Band',  placeholder:'e.g. Senior' },
    { name:'minSalary', label:'Min CTC (₹)', type:'number', placeholder:'1800000' },
    { name:'maxSalary', label:'Max CTC (₹)', type:'number', placeholder:'2800000' },
    { name:'roles', label:'Applicable Roles (comma separated)', placeholder:'Tech Lead, Principal Engineer' },
  ],
  'HR Policies': [
    { name:'name', label:'Policy Name', placeholder:'e.g. Leave Policy v2.0' },
    { name:'type', label:'Type', type:'select', options:['Leave','Attendance','Conduct','Expense','Security','Performance','Other'] },
    { name:'effectiveDate', label:'Effective Date', type:'date' },
    { name:'status', label:'Status', type:'select', options:['active','draft','archived'] },
  ],
}

export default function HRConfig() {
  const [tab, setTab]       = useState('Employment Types')
  const [data, setData]     = useState({ 'Employment Types':[], 'Shift Policies':[], 'Grade & Band':[], 'HR Policies':[] })
  const [loading, setLoading] = useState(true)
  const [modal, setModal]   = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm]     = useState({})
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const fetchTab = async (currentTab) => {
    setLoading(true)
    try {
      let res
      if (currentTab === 'Employment Types') res = await hrConfigService.getEmploymentTypes()
      if (currentTab === 'Shift Policies')    res = await hrConfigService.getShifts()
      if (currentTab === 'Grade & Band')      res = await hrConfigService.getGrades()
      if (currentTab === 'HR Policies')       res = await hrConfigService.getPolicies()
      setData(p => ({ ...p, [currentTab]: res.data || [] }))
    } catch { toast.error('Failed to load data') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchTab(tab) }, [tab])

  const openAdd = () => { setEditTarget(null); setForm({}); setModal(true) }
  const openEdit = (item) => {
    setEditTarget(item)
    setForm({ ...item, roles: Array.isArray(item.roles) ? item.roles.join(', ') : item.roles })
    setModal(true)
  }

  const handleChange = (name, value) => setForm(p => ({ ...p, [name]: value }))

  const handleSave = async () => {
    setSaving(true)
    try {
      let payload = { ...form }
      if (tab === 'Grade & Band' && typeof payload.roles === 'string') {
        payload.roles = payload.roles.split(',').map(r => r.trim()).filter(Boolean)
      }
      if (tab === 'Employment Types') {
        editTarget ? await hrConfigService.updateEmploymentType(editTarget._id, payload) : await hrConfigService.createEmploymentType(payload)
      } else if (tab === 'Shift Policies') {
        editTarget ? await hrConfigService.updateShift(editTarget._id, payload) : await hrConfigService.createShift(payload)
      } else if (tab === 'Grade & Band') {
        editTarget ? await hrConfigService.updateGrade(editTarget._id, payload) : await hrConfigService.createGrade(payload)
      } else if (tab === 'HR Policies') {
        editTarget ? await hrConfigService.updatePolicy(editTarget._id, payload) : await hrConfigService.createPolicy(payload)
      }
      toast.success(editTarget ? 'Updated successfully' : 'Created successfully')
      setModal(false)
      fetchTab(tab)
    } catch (err) {
      toast.error(err?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async (item) => {
    try {
      if (tab === 'Employment Types') await hrConfigService.toggleEmploymentType(item._id)
      if (tab === 'Shift Policies')    await hrConfigService.toggleShift(item._id)
      fetchTab(tab)
    } catch { toast.error('Failed to update status') }
  }

  const handleDelete = async () => {
    try {
      if (tab === 'Employment Types') await hrConfigService.deleteEmploymentType(deleteTarget._id)
      if (tab === 'Shift Policies')    await hrConfigService.deleteShift(deleteTarget._id)
      if (tab === 'Grade & Band')      await hrConfigService.deleteGrade(deleteTarget._id)
      if (tab === 'HR Policies')       await hrConfigService.deletePolicy(deleteTarget._id)
      toast.success('Deleted')
      setDeleteTarget(null)
      fetchTab(tab)
    } catch { toast.error('Delete failed') }
  }

  const list = data[tab] || []

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border bg-white">
        <div>
          <h2 className="font-700 text-text-primary">HR Configuration</h2>
          <p className="text-xs text-text-muted">Manage employment types, shifts, grades and policies</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-md text-xs font-600 hover:bg-primary-dark transition-colors">
          <Plus size={13}/> Add New
        </button>
      </div>

      <div className="flex border-b border-border bg-white px-5">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`py-2.5 px-3 text-xs font-600 border-b-2 transition-colors whitespace-nowrap
              ${tab===t ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-primary'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {loading ? (
          <div className="flex items-center justify-center h-48"><Spinner size="lg"/></div>
        ) : list.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-text-muted">
            <p className="text-sm">No {tab.toLowerCase()} found</p>
            <button onClick={openAdd} className="mt-2 text-xs font-600 text-primary hover:underline">Add the first one</button>
          </div>
        ) : (
          <>
            {tab === 'Employment Types' && (
              <div className="bg-white border border-border rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-border">
                      {['Type','Code','Notice Period','Probation','Status','Actions'].map(h => (
                        <th key={h} className="text-left px-4 py-2.5 text-[10px] font-700 text-text-muted uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {list.map(et => (
                      <tr key={et._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-600 text-text-primary">{et.name}</td>
                        <td className="px-4 py-3"><span className="px-2 py-0.5 bg-slate-100 text-text-secondary rounded font-600">{et.code}</span></td>
                        <td className="px-4 py-3 text-text-secondary">{et.noticeDays} days</td>
                        <td className="px-4 py-3 text-text-secondary">{et.probationDays ? `${et.probationDays} days` : '—'}</td>
                        <td className="px-4 py-3"><Toggle2 on={et.isActive} onClick={() => handleToggle(et)}/></td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => openEdit(et)} className="text-text-muted hover:text-primary transition-colors"><Edit2 size={13}/></button>
                            <button onClick={() => setDeleteTarget(et)} className="text-text-muted hover:text-red-500 transition-colors"><Trash2 size={13}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {tab === 'Shift Policies' && (
              <div className="grid grid-cols-2 gap-3">
                {list.map(s => (
                  <div key={s._id} className="bg-white border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm font-700 text-text-primary">{s.name}</p>
                        <p className="text-[10px] text-text-muted">Code: {s.code || '—'}</p>
                      </div>
                      <Toggle2 on={s.isActive} onClick={() => handleToggle(s)}/>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[['Start Time',s.startTime||'—'],['End Time',s.endTime||'—'],['Break',`${s.breakMinutes||0} min`],['Working Days',s.workDays||'—']].map(([l,v]) => (
                        <div key={l} className="bg-slate-50 rounded-md p-2">
                          <p className="text-text-muted text-[10px]">{l}</p>
                          <p className="font-700 text-text-primary mt-0.5">{v}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => openEdit(s)} className="flex-1 text-xs font-600 text-primary border border-primary/30 rounded-md py-1 hover:bg-primary/5 transition-colors">Edit</button>
                      <button onClick={() => setDeleteTarget(s)} className="px-3 text-xs font-600 text-red-500 border border-red-200 rounded-md hover:bg-red-50 transition-colors">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'Grade & Band' && (
              <div className="bg-white border border-border rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-border">
                      {['Grade','Band','Min CTC','Max CTC','Applicable Roles','Actions'].map(h => (
                        <th key={h} className="text-left px-4 py-2.5 text-[10px] font-700 text-text-muted uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {list.map(g => (
                      <tr key={g._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3"><span className="px-2 py-0.5 bg-violet-100 text-violet-700 rounded font-700">{g.grade}</span></td>
                        <td className="px-4 py-3 font-600 text-text-primary">{g.band}</td>
                        <td className="px-4 py-3 text-text-secondary">{g.minSalary ? `₹${(g.minSalary/100000).toFixed(0)}L` : '—'}</td>
                        <td className="px-4 py-3 text-text-secondary">{g.maxSalary ? `₹${(g.maxSalary/100000).toFixed(0)}L` : '—'}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {(g.roles||[]).map(r => <span key={r} className="px-1.5 py-0.5 bg-slate-100 text-text-muted rounded text-[9px]">{r}</span>)}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => openEdit(g)} className="text-text-muted hover:text-primary transition-colors"><Edit2 size={13}/></button>
                            <button onClick={() => setDeleteTarget(g)} className="text-text-muted hover:text-red-500 transition-colors"><Trash2 size={13}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {tab === 'HR Policies' && (
              <div className="space-y-2">
                {list.map(p => (
                  <div key={p._id} className="bg-white border border-border rounded-lg p-4 flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-700 text-text-primary">{p.name}</p>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-700 ${POLICY_COLORS[p.type] || POLICY_COLORS.Other}`}>{p.type}</span>
                        {p.status === 'draft' && <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-700">Draft</span>}
                      </div>
                      <p className="text-xs text-text-muted">
                        Effective from: {p.effectiveDate ? new Date(p.effectiveDate).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) : '—'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(p)} className="text-xs font-600 text-text-secondary hover:text-primary border border-border px-2 py-1 rounded-md hover:border-primary/30 transition-colors">Edit</button>
                      <button onClick={() => setDeleteTarget(p)} className="text-text-muted hover:text-red-500 transition-colors"><Trash2 size={13}/></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title={`${editTarget ? 'Edit' : 'Add'} ${tab.slice(0,-1)}`} size="sm">
        <div className="space-y-3">
          {(FORM_FIELDS[tab] || []).map(f => (
            <div key={f.name}>
              <label className="block text-xs font-600 text-text-primary mb-1.5">{f.label}</label>
              {f.type === 'select' ? (
                <select value={form[f.name] || ''} onChange={e => handleChange(f.name, e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white text-text-secondary">
                  <option value="">Select {f.label}</option>
                  {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input
                  type={f.type || 'text'}
                  value={form[f.name] || ''}
                  onChange={e => handleChange(f.name, e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              )}
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setModal(false)} className="px-4 py-2 border border-border rounded-md text-sm font-600 text-text-secondary hover:bg-slate-50">Cancel</button>
            <button onClick={handleSave} disabled={saving}
              className="px-4 py-2 bg-primary text-white rounded-md text-sm font-600 hover:bg-primary-dark disabled:opacity-60 flex items-center gap-2">
              {saving && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"/>}
              {editTarget ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Confirm Delete" size="sm">
        <p className="text-sm text-text-secondary mb-4">
          Are you sure you want to delete <strong>{deleteTarget?.name || deleteTarget?.grade}</strong>?
        </p>
        <div className="flex justify-end gap-2">
          <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 border border-border rounded-md text-sm font-600 text-text-secondary hover:bg-slate-50">Cancel</button>
          <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-md text-sm font-600 hover:bg-red-600">Delete</button>
        </div>
      </Modal>
    </div>
  )
}