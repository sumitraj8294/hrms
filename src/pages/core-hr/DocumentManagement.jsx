import { useState, useEffect, useRef } from 'react'
import { Upload, Search, AlertTriangle, CheckCircle2, Clock, FileText, Download, Eye, Trash2, Plus, RefreshCw, ShieldCheck } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'
import Modal from '@/components/ui/Modal'
import Spinner from '@/components/ui/Spinner'
import { documentService, employeeService } from '@/services/employeeService'
import { formatDate } from '@/utils/formatDate'
import toast from 'react-hot-toast'

const TYPE_COLORS = {
  Contract:  'bg-violet-100 text-violet-700',
  Agreement: 'bg-blue-100 text-blue-700',
  Policy:    'bg-emerald-100 text-emerald-700',
  'ID Proof':'bg-amber-100 text-amber-700',
  Education: 'bg-pink-100 text-pink-700',
  Other:     'bg-slate-100 text-slate-600',
}

const STATUS_MAP = {
  verified: { label:'Verified', variant:'green',  icon:CheckCircle2  },
  pending:  { label:'Pending',  variant:'yellow', icon:Clock         },
  expiring: { label:'Expiring', variant:'red',    icon:AlertTriangle },
}

const TABS = ['All Documents','Contracts & Agreements','Policy Documents','Expiry Tracking']

const EMPTY_FORM = { name:'', employee:'', type:'Contract', expiryDate:'', file: null }

// Derive status from isVerified + expiryDate
function getDocStatus(doc) {
  if (doc.expiryDate) {
    const daysLeft = (new Date(doc.expiryDate) - Date.now()) / (1000*60*60*24)
    if (daysLeft < 0)  return 'expired'
    if (daysLeft < 30) return 'expiring'
  }
  return doc.isVerified ? 'verified' : 'pending'
}

export default function DocumentManagement() {
  const [docs, setDocs]         = useState([])
  const [employees, setEmps]    = useState([])
  const [loading, setLoading]   = useState(true)
  const [uploading, setUploading] = useState(false)
  const [tab, setTab]           = useState('All Documents')
  const [search, setSearch]     = useState('')
  const [modal, setModal]       = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [form, setForm]         = useState(EMPTY_FORM)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef()

  const fetchDocs = async () => {
    setLoading(true)
    try {
      const res = await documentService.getAll()
      setDocs(res.data?.docs || [])
    } catch { toast.error('Failed to load documents') }
    finally  { setLoading(false) }
  }

  useEffect(() => {
    fetchDocs()
    employeeService.getAll({ limit:200 })
      .then(r => setEmps(r.data?.employees || []))
      .catch(() => {})
  }, [])

  // Tab + search filter
  const filtered = docs.filter(doc => {
    const status = getDocStatus(doc)
    const q = search.toLowerCase()
    const matchSearch = doc.name.toLowerCase().includes(q) ||
      (doc.employee ? `${doc.employee.firstName} ${doc.employee.lastName}`.toLowerCase().includes(q) : false)
    if (tab === 'Contracts & Agreements') return matchSearch && ['Contract','Agreement'].includes(doc.type)
    if (tab === 'Policy Documents')       return matchSearch && doc.type === 'Policy'
    if (tab === 'Expiry Tracking')        return matchSearch && !!doc.expiryDate
    return matchSearch
  })

  const expiring = docs.filter(d => getDocStatus(d) === 'expiring')
  const pending  = docs.filter(d => !d.isVerified)

  const handleFileSelect = (file) => {
    if (!file) return
    if (file.size > 5 * 1024 * 1024) return toast.error('File must be under 5MB')
    setForm(p => ({ ...p, file, name: p.name || file.name.replace(/\.[^.]+$/, '') }))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFileSelect(e.dataTransfer.files[0])
  }

  const handleUpload = async () => {
    if (!form.name.trim()) return toast.error('Document name is required')
    if (!form.file)        return toast.error('Please select a file')
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file',       form.file)
      fd.append('name',       form.name)
      fd.append('type',       form.type)
      if (form.employee)   fd.append('employee',   form.employee)
      if (form.expiryDate) fd.append('expiryDate', form.expiryDate)
      await documentService.upload(fd)
      toast.success('Document uploaded successfully')
      setModal(false)
      setForm(EMPTY_FORM)
      fetchDocs()
    } catch (err) {
      toast.error(err?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleVerify = async (id) => {
    try {
      await documentService.verify(id)
      toast.success('Document verified')
      fetchDocs()
    } catch { toast.error('Failed to verify') }
  }

  const handleDelete = async () => {
    try {
      await documentService.delete(deleteTarget._id)
      toast.success('Document deleted')
      setDeleteTarget(null)
      fetchDocs()
    } catch { toast.error('Failed to delete') }
  }

  const handleView = (doc) => {
    const url = `${import.meta.env.VITE_API_BASE_URL?.replace('/api','')}${doc.fileUrl}`
    window.open(url, '_blank')
  }

  const handleDownload = async (doc) => {
    const url = `${import.meta.env.VITE_API_BASE_URL?.replace('/api','')}${doc.fileUrl}`
    const a   = document.createElement('a')
    a.href    = url
    a.download= doc.name
    a.click()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border bg-white">
        <div>
          <h2 className="font-700 text-text-primary">Document Management</h2>
          <p className="text-xs text-text-muted">{docs.length} documents total</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchDocs} className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-md text-xs font-600 text-text-secondary hover:bg-slate-50 transition-colors">
            <RefreshCw size={13}/>
          </button>
          <button onClick={() => { setForm(EMPTY_FORM); setModal(true) }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-md text-xs font-600 hover:bg-primary-dark transition-colors">
            <Plus size={13}/> Upload Document
          </button>
        </div>
      </div>

      {/* Alert strip */}
      {(expiring.length > 0 || pending.length > 0) && (
        <div className="flex gap-4 px-5 py-2 bg-amber-50 border-b border-amber-200">
          {expiring.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-amber-700">
              <AlertTriangle size={13}/>
              <span><strong>{expiring.length}</strong> expiring within 30 days</span>
            </div>
          )}
          {pending.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-amber-700">
              <Clock size={13}/>
              <span><strong>{pending.length}</strong> pending verification</span>
            </div>
          )}
        </div>
      )}

      {/* Tabs + Search */}
      <div className="flex items-center justify-between border-b border-border bg-white px-5">
        <div className="flex">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`py-2.5 px-3 text-xs font-600 border-b-2 transition-colors whitespace-nowrap
                ${tab===t ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-primary'}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search documents…"
            className="pl-8 pr-3 py-1.5 border border-border rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all w-52"/>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto p-5">
        {loading ? (
          <div className="flex items-center justify-center h-48"><Spinner size="lg"/></div>
        ) : (
          <div className="bg-white border border-border rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-border">
                  {['Document Name','Employee','Type','Uploaded','Expiry','Status','Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-[10px] font-700 text-text-muted uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(doc => {
                  const status = getDocStatus(doc)
                  const s      = STATUS_MAP[status] || STATUS_MAP.pending
                  const Icon   = s.icon
                  const empName = doc.employee ? `${doc.employee.firstName} ${doc.employee.lastName}` : null

                  return (
                    <tr key={doc._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <FileText size={14} className="text-text-muted flex-shrink-0"/>
                          <span className="font-600 text-text-primary">{doc.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {empName ? (
                          <div className="flex items-center gap-1.5">
                            <Avatar name={empName} size="sm"/>
                            <span className="text-text-secondary">{empName}</span>
                          </div>
                        ) : (
                          <span className="text-[10px] font-600 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">All Employees</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-700 ${TYPE_COLORS[doc.type] || TYPE_COLORS.Other}`}>
                          {doc.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-text-secondary">{formatDate(doc.createdAt)}</td>
                      <td className="px-4 py-3">
                        {doc.expiryDate ? (
                          <span className={`font-600 ${status==='expiring' || status==='expired' ? 'text-red-500' : 'text-text-secondary'}`}>
                            {formatDate(doc.expiryDate)}
                          </span>
                        ) : <span className="text-text-muted">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Icon size={12} className={
                            status==='verified' ? 'text-emerald-500' :
                            status==='expiring' || status==='expired' ? 'text-red-500' : 'text-amber-500'
                          }/>
                          <Badge variant={s.variant}>{s.label}</Badge>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => handleView(doc)}
                            className="text-text-muted hover:text-primary transition-colors" title="View">
                            <Eye size={13}/>
                          </button>
                          <button onClick={() => handleDownload(doc)}
                            className="text-text-muted hover:text-primary transition-colors" title="Download">
                            <Download size={13}/>
                          </button>
                          {!doc.isVerified && (
                            <button onClick={() => handleVerify(doc._id)}
                              className="text-text-muted hover:text-emerald-500 transition-colors" title="Verify">
                              <ShieldCheck size={13}/>
                            </button>
                          )}
                          <button onClick={() => setDeleteTarget(doc)}
                            className="text-text-muted hover:text-red-500 transition-colors" title="Delete">
                            <Trash2 size={13}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filtered.length === 0 && !loading && (
              <div className="flex flex-col items-center py-12 text-text-muted">
                <FileText size={28} className="mb-2 opacity-30"/>
                <p className="text-sm">No documents found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title="Upload Document" size="sm">
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-600 text-text-primary mb-1.5">Document Name <span className="text-red-500">*</span></label>
            <input value={form.name} onChange={e => setForm(p=>({...p,name:e.target.value}))}
              placeholder="e.g. Offer Letter – Priya Sharma"
              className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"/>
          </div>

          <div>
            <label className="block text-xs font-600 text-text-primary mb-1.5">Employee (optional)</label>
            <select value={form.employee} onChange={e => setForm(p=>({...p,employee:e.target.value}))}
              className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white text-text-secondary">
              <option value="">All Employees / General</option>
              {employees.map(e => (
                <option key={e._id} value={e._id}>{e.firstName} {e.lastName} ({e.employeeId})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-600 text-text-primary mb-1.5">Document Type</label>
            <select value={form.type} onChange={e => setForm(p=>({...p,type:e.target.value}))}
              className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white text-text-secondary">
              {['Contract','Agreement','Policy','ID Proof','Education','Other'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-600 text-text-primary mb-1.5">Expiry Date (optional)</label>
            <input type="date" value={form.expiryDate} onChange={e => setForm(p=>({...p,expiryDate:e.target.value}))}
              className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"/>
          </div>

          {/* Drop zone */}
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors
              ${dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'}`}
          >
            <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" className="hidden"
              onChange={e => handleFileSelect(e.target.files[0])}/>
            {form.file ? (
              <div className="flex items-center justify-center gap-2 text-primary">
                <FileText size={16}/>
                <span className="text-xs font-600">{form.file.name}</span>
                <span className="text-[10px] text-text-muted">({(form.file.size/1024).toFixed(0)} KB)</span>
              </div>
            ) : (
              <>
                <Upload size={20} className="text-text-muted mx-auto mb-2"/>
                <p className="text-xs font-600 text-text-primary">Click to upload or drag & drop</p>
                <p className="text-[10px] text-text-muted mt-0.5">PDF, JPG, PNG, DOC · Max 5MB</p>
              </>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button onClick={() => setModal(false)}
              className="px-4 py-2 border border-border rounded-md text-sm font-600 text-text-secondary hover:bg-slate-50">
              Cancel
            </button>
            <button onClick={handleUpload} disabled={uploading}
              className="px-4 py-2 bg-primary text-white rounded-md text-sm font-600 hover:bg-primary-dark disabled:opacity-60 flex items-center gap-2">
              {uploading && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"/>}
              {uploading ? 'Uploading…' : 'Upload'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Document" size="sm">
        <p className="text-sm text-text-secondary mb-4">
          Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This will also remove the file from storage.
        </p>
        <div className="flex justify-end gap-2">
          <button onClick={() => setDeleteTarget(null)}
            className="px-4 py-2 border border-border rounded-md text-sm font-600 text-text-secondary hover:bg-slate-50">
            Cancel
          </button>
          <button onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-md text-sm font-600 hover:bg-red-600">
            Delete
          </button>
        </div>
      </Modal>
    </div>
  )
}