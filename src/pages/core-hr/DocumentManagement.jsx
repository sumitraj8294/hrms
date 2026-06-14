import { useState } from 'react'
import { Upload, Search, AlertTriangle, CheckCircle2, Clock, FileText, Download, Eye, Trash2, Plus } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'
import Modal from '@/components/ui/Modal'

const DOCS = [
  { id:1, name:'Offer Letter – Priya Sharma',      employee:'Priya Sharma', type:'Contract',  uploaded:'12 Jan 2022', expiry:null,         status:'verified', size:'245 KB' },
  { id:2, name:'Non-Disclosure Agreement',         employee:'Rahul Verma',  type:'Agreement', uploaded:'05 Mar 2023', expiry:'04 Mar 2025', status:'verified', size:'182 KB' },
  { id:3, name:'HR Policy Handbook v3.0',          employee:'All',          type:'Policy',    uploaded:'01 Jan 2024', expiry:null,         status:'verified', size:'1.2 MB' },
  { id:4, name:'ID Proof – Siddharth K.',          employee:'Siddharth K.', type:'ID Proof',  uploaded:'01 Sep 2023', expiry:'31 Aug 2025', status:'pending',  size:'320 KB' },
  { id:5, name:'Medical Insurance Policy',         employee:'All',          type:'Policy',    uploaded:'01 Apr 2024', expiry:'31 Mar 2025', status:'expiring', size:'890 KB' },
  { id:6, name:'Employment Contract – Kavya Nair', employee:'Kavya Nair',   type:'Contract',  uploaded:'15 Nov 2023', expiry:'14 Nov 2024', status:'expiring', size:'210 KB' },
  { id:7, name:'Education Certificate – Anita Roy',employee:'Anita Roy',    type:'Education', uploaded:'20 Jun 2021', expiry:null,         status:'verified', size:'450 KB' },
]

const TYPE_COLORS = { Contract:'bg-violet-100 text-violet-700', Agreement:'bg-blue-100 text-blue-700', Policy:'bg-emerald-100 text-emerald-700', 'ID Proof':'bg-amber-100 text-amber-700', Education:'bg-pink-100 text-pink-700' }
const STATUS_MAP  = { verified:{ label:'Verified', variant:'green', icon:CheckCircle2 }, pending:{ label:'Pending', variant:'yellow', icon:Clock }, expiring:{ label:'Expiring', variant:'red', icon:AlertTriangle } }

const TABS = ['All Documents','Contracts & Agreements','Policy Documents','Expiry Tracking']

export default function DocumentManagement() {
  const [tab, setTab]       = useState('All Documents')
  const [search, setSearch] = useState('')
  const [modal, setModal]   = useState(false)

  const expiring = DOCS.filter(d => d.status === 'expiring')
  const pending  = DOCS.filter(d => d.status === 'pending')

  const filtered = DOCS.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.employee.toLowerCase().includes(search.toLowerCase())
    if (tab === 'Contracts & Agreements') return matchSearch && ['Contract','Agreement'].includes(d.type)
    if (tab === 'Policy Documents')       return matchSearch && d.type === 'Policy'
    if (tab === 'Expiry Tracking')        return matchSearch && d.expiry
    return matchSearch
  })

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border bg-white">
        <div>
          <h2 className="font-700 text-text-primary">Document Management</h2>
          <p className="text-xs text-text-muted">{DOCS.length} documents total</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-md text-xs font-600 text-text-secondary hover:bg-slate-50 transition-colors">
            <Upload size={13}/> Bulk Upload
          </button>
          <button onClick={() => setModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-md text-xs font-600 hover:bg-primary-dark transition-colors">
            <Plus size={13}/> Add Document
          </button>
        </div>
      </div>

      {/* Alert strip */}
      {(expiring.length > 0 || pending.length > 0) && (
        <div className="flex gap-3 px-5 py-2.5 bg-amber-50 border-b border-amber-200">
          {expiring.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-amber-700">
              <AlertTriangle size={13}/>
              <span><strong>{expiring.length}</strong> documents expiring soon</span>
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
                const s = STATUS_MAP[doc.status]
                const Icon = s.icon
                return (
                  <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-text-muted flex-shrink-0"/>
                        <span className="font-600 text-text-primary">{doc.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {doc.employee === 'All' ? (
                        <span className="text-[10px] font-600 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">All Employees</span>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <Avatar name={doc.employee} size="sm"/>
                          <span className="text-text-secondary">{doc.employee}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-700 ${TYPE_COLORS[doc.type] || 'bg-slate-100 text-slate-600'}`}>{doc.type}</span>
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{doc.uploaded}</td>
                    <td className="px-4 py-3">
                      {doc.expiry ? (
                        <span className={`font-600 ${doc.status==='expiring' ? 'text-red-500' : 'text-text-secondary'}`}>{doc.expiry}</span>
                      ) : <span className="text-text-muted">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Icon size={12} className={doc.status==='verified' ? 'text-emerald-500' : doc.status==='expiring' ? 'text-red-500' : 'text-amber-500'}/>
                        <Badge variant={s.variant}>{s.label}</Badge>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button className="text-text-muted hover:text-primary transition-colors" title="View"><Eye size={13}/></button>
                        <button className="text-text-muted hover:text-primary transition-colors" title="Download"><Download size={13}/></button>
                        <button className="text-text-muted hover:text-red-500 transition-colors" title="Delete"><Trash2 size={13}/></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center py-12 text-text-muted">
              <FileText size={28} className="mb-2 opacity-30"/>
              <p className="text-sm">No documents found</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title="Upload Document" size="sm">
        <div className="space-y-3">
          {[['Document Name','e.g. Offer Letter – Priya Sharma'],['Employee','Select employee']].map(([l,p]) => (
            <div key={l}>
              <label className="block text-xs font-600 text-text-primary mb-1.5">{l}</label>
              <input placeholder={p} className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"/>
            </div>
          ))}
          <div>
            <label className="block text-xs font-600 text-text-primary mb-1.5">Document Type</label>
            <select className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white text-text-secondary">
              {['Contract','Agreement','Policy','ID Proof','Education','Other'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-600 text-text-primary mb-1.5">Expiry Date (optional)</label>
            <input type="date" className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"/>
          </div>
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/40 transition-colors">
            <Upload size={20} className="text-text-muted mx-auto mb-2"/>
            <p className="text-xs font-600 text-text-primary">Click to upload or drag & drop</p>
            <p className="text-[10px] text-text-muted mt-0.5">PDF, JPG, PNG · Max 5MB</p>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button onClick={() => setModal(false)} className="px-4 py-2 border border-border rounded-md text-sm font-600 text-text-secondary hover:bg-slate-50">Cancel</button>
            <button className="px-4 py-2 bg-primary text-white rounded-md text-sm font-600 hover:bg-primary-dark">Upload</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}