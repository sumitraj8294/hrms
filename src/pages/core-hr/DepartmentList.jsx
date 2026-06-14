import { useState } from 'react'
import { Plus, Edit2, Trash2, Users, Building2 } from 'lucide-react'
import Modal from '@/components/ui/Modal'

const DEPARTMENTS = [
  { id:1, name:'Engineering',  code:'ENG',   head:'Neha Kapoor', count:85, bu:'Product',   costCenter:'CC-ENG-01',  status:'active' },
  { id:2, name:'Sales',        code:'SALES', head:'Pooja Iyer',  count:42, bu:'Revenue',   costCenter:'CC-SALES-01',status:'active' },
  { id:3, name:'Human Resources',code:'HR',  head:'Ravi Kumar',  count:18, bu:'Corporate', costCenter:'CC-HR-01',   status:'active' },
  { id:4, name:'Finance',      code:'FIN',   head:'Divya S.',    count:25, bu:'Corporate', costCenter:'CC-FIN-01',  status:'active' },
  { id:5, name:'Operations',   code:'OPS',   head:'Arjun Singh', count:38, bu:'Platform',  costCenter:'CC-OPS-01',  status:'active' },
  { id:6, name:'Marketing',    code:'MKT',   head:'Kavya Nair',  count:22, bu:'Revenue',   costCenter:'CC-MKT-01',  status:'active' },
]

const DEPT_COLORS = ['bg-violet-100 text-violet-600','bg-blue-100 text-blue-600','bg-emerald-100 text-emerald-600',
  'bg-amber-100 text-amber-600','bg-pink-100 text-pink-600','bg-cyan-100 text-cyan-600']

export default function DepartmentList() {
  const [modal, setModal] = useState(false)
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border bg-white">
        <div>
          <h2 className="font-700 text-text-primary">Department Management</h2>
          <p className="text-xs text-text-muted">{DEPARTMENTS.length} departments</p>
        </div>
        <button onClick={() => setModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-md text-xs font-600 hover:bg-primary-dark transition-colors">
          <Plus size={13}/> Add Department
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {DEPARTMENTS.map((d, i) => (
            <div key={d.id} className="bg-white border border-border rounded-lg p-4 hover:shadow-card-hover transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${DEPT_COLORS[i % DEPT_COLORS.length]} flex items-center justify-center font-700 text-sm`}>
                  {d.code.slice(0,2)}
                </div>
                <div className="flex gap-1">
                  <button className="w-6 h-6 rounded-md hover:bg-slate-100 flex items-center justify-center text-text-muted hover:text-primary transition-colors">
                    <Edit2 size={12}/>
                  </button>
                  <button className="w-6 h-6 rounded-md hover:bg-red-50 flex items-center justify-center text-text-muted hover:text-red-500 transition-colors">
                    <Trash2 size={12}/>
                  </button>
                </div>
              </div>
              <p className="text-sm font-700 text-text-primary">{d.name}</p>
              <p className="text-[10px] text-text-muted mb-2">Code: {d.code}</p>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted">Head</span>
                  <span className="font-600 text-text-primary">{d.head}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted flex items-center gap-1"><Users size={10}/>Employees</span>
                  <span className="font-600 text-text-primary">{d.count}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted">Business Unit</span>
                  <span className="font-600 text-text-primary">{d.bu}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted">Cost Center</span>
                  <span className="font-600 text-text-primary">{d.costCenter}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Add Department" size="sm">
        <div className="space-y-3">
          {[['Department Name','e.g. Engineering'],['Department Code','e.g. ENG'],['Business Unit',''],['Cost Center Code','CC-XXX-01']].map(([l,p]) => (
            <div key={l}>
              <label className="block text-xs font-600 text-text-primary mb-1.5">{l}</label>
              <input placeholder={p} className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"/>
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setModal(false)} className="px-4 py-2 border border-border rounded-md text-sm font-600 text-text-secondary hover:bg-slate-50">Cancel</button>
            <button className="px-4 py-2 bg-primary text-white rounded-md text-sm font-600 hover:bg-primary-dark">Save</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}