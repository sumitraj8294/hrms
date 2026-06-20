import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Users, RefreshCw } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import Spinner from '@/components/ui/Spinner'
import { departmentService } from '@/services/employeeService'
import toast from 'react-hot-toast'

const DEPT_COLORS = [
  'bg-violet-100 text-violet-600','bg-blue-100 text-blue-600',
  'bg-emerald-100 text-emerald-600','bg-amber-100 text-amber-600',
  'bg-pink-100 text-pink-600','bg-cyan-100 text-cyan-600',
]

const EMPTY_FORM = { name:'', code:'', businessUnit:'', costCenter:'' }

export default function DepartmentList() {
  const [departments, setDepts]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [modal, setModal]         = useState(false)
  const [editTarget, setEditTarget] = useState(null) // dept being edited
  const [form, setForm]           = useState(EMPTY_FORM)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const fetchDepts = async () => {
    setLoading(true)
    try {
      const res = await departmentService.getAll()
      setDepts(res.data || [])
    } catch {
      toast.error('Failed to load departments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDepts() }, [])

  const openAdd = () => {
    setEditTarget(null)
    setForm(EMPTY_FORM)
    setModal(true)
  }

  const openEdit = (dept) => {
    setEditTarget(dept)
    setForm({
      name:         dept.name         || '',
      code:         dept.code         || '',
      businessUnit: dept.businessUnit || '',
      costCenter:   dept.costCenter   || '',
    })
    setModal(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error('Department name is required')
    if (!form.code.trim()) return toast.error('Department code is required')
    setSaving(true)
    try {
      if (editTarget) {
        await departmentService.update(editTarget._id, form)
        toast.success('Department updated')
      } else {
        await departmentService.create(form)
        toast.success('Department created')
      }
      setModal(false)
      fetchDepts()
    } catch (err) {
      toast.error(err?.message || 'Failed to save department')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await departmentService.delete(deleteTarget._id)
      toast.success('Department deactivated')
      setDeleteTarget(null)
      fetchDepts()
    } catch {
      toast.error('Failed to delete department')
    }
  }

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border bg-white">
        <div>
          <h2 className="font-700 text-text-primary">Department Management</h2>
          <p className="text-xs text-text-muted">{departments.length} departments</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchDepts} className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-md text-xs font-600 text-text-secondary hover:bg-slate-50 transition-colors">
            <RefreshCw size={13}/>
          </button>
          <button onClick={openAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-md text-xs font-600 hover:bg-primary-dark transition-colors">
            <Plus size={13}/> Add Department
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {loading ? (
          <div className="flex items-center justify-center h-48"><Spinner size="lg"/></div>
        ) : departments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-text-muted">
            <p className="text-sm">No departments found</p>
            <button onClick={openAdd} className="mt-3 text-xs font-600 text-primary hover:underline">Add your first department</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {departments.map((d, i) => (
              <div key={d._id} className="bg-white border border-border rounded-lg p-4 hover:shadow-card-hover transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg ${DEPT_COLORS[i % DEPT_COLORS.length]} flex items-center justify-center font-700 text-sm`}>
                    {d.code?.slice(0,2) || d.name?.slice(0,2)}
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(d)}
                      className="w-6 h-6 rounded-md hover:bg-slate-100 flex items-center justify-center text-text-muted hover:text-primary transition-colors">
                      <Edit2 size={12}/>
                    </button>
                    <button onClick={() => setDeleteTarget(d)}
                      className="w-6 h-6 rounded-md hover:bg-red-50 flex items-center justify-center text-text-muted hover:text-red-500 transition-colors">
                      <Trash2 size={12}/>
                    </button>
                  </div>
                </div>
                <p className="text-sm font-700 text-text-primary">{d.name}</p>
                <p className="text-[10px] text-text-muted mb-2">Code: {d.code || '—'}</p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-muted">Head</span>
                    <span className="font-600 text-text-primary">
                      {d.head ? `${d.head.firstName} ${d.head.lastName}` : '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-muted flex items-center gap-1"><Users size={10}/>Employees</span>
                    <span className="font-600 text-text-primary">{d.employeeCount ?? '—'}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-muted">Business Unit</span>
                    <span className="font-600 text-text-primary">{d.businessUnit || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-muted">Cost Center</span>
                    <span className="font-600 text-text-primary">{d.costCenter || '—'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={editTarget ? 'Edit Department' : 'Add Department'}
        size="sm"
      >
        <div className="space-y-3">
          {[
            { label:'Department Name', name:'name',         placeholder:'e.g. Engineering',  required:true  },
            { label:'Department Code', name:'code',         placeholder:'e.g. ENG',          required:true  },
            { label:'Business Unit',   name:'businessUnit', placeholder:'e.g. Product',      required:false },
            { label:'Cost Center',     name:'costCenter',   placeholder:'e.g. CC-ENG-01',    required:false },
          ].map(f => (
            <div key={f.name}>
              <label className="block text-xs font-600 text-text-primary mb-1.5">
                {f.label}{f.required && <span className="text-red-500 ml-0.5">*</span>}
              </label>
              <input
                name={f.name}
                value={form[f.name]}
                onChange={handleChange}
                placeholder={f.placeholder}
                className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setModal(false)}
              className="px-4 py-2 border border-border rounded-md text-sm font-600 text-text-secondary hover:bg-slate-50">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving}
              className="px-4 py-2 bg-primary text-white rounded-md text-sm font-600 hover:bg-primary-dark disabled:opacity-60 flex items-center gap-2">
              {saving && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"/>}
              {editTarget ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Deactivate Department" size="sm">
        <p className="text-sm text-text-secondary mb-4">
          Are you sure you want to deactivate <strong>{deleteTarget?.name}</strong>? This won't delete existing employees.
        </p>
        <div className="flex justify-end gap-2">
          <button onClick={() => setDeleteTarget(null)}
            className="px-4 py-2 border border-border rounded-md text-sm font-600 text-text-secondary hover:bg-slate-50">
            Cancel
          </button>
          <button onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-md text-sm font-600 hover:bg-red-600">
            Deactivate
          </button>
        </div>
      </Modal>
    </div>
  )
}