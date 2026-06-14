import { useState } from 'react'
import { Plus, Edit2, Trash2, Menu } from 'lucide-react'
import Modal from '@/components/ui/Modal'

const TABS = ['Employment Types','Shift Policies','Grade & Band','HR Policies']

const EMPLOYMENT_TYPES = [
  { name:'Full-Time',  code:'FT', notice:'60 days',  probation:'90 days',  active:true  },
  { name:'Part-Time',  code:'PT', notice:'30 days',  probation:'60 days',  active:true  },
  { name:'Contract',   code:'CT', notice:'15 days',  probation:'-',        active:true  },
  { name:'Intern',     code:'IN', notice:'7 days',   probation:'30 days',  active:true  },
  { name:'Consultant', code:'CS', notice:'15 days',  probation:'-',        active:false },
]

const SHIFTS = [
  { name:'General Shift',  code:'GS', start:'09:00', end:'18:00', breakMins:60, days:'Mon–Fri', active:true  },
  { name:'Morning Shift',  code:'MS', start:'07:00', end:'16:00', breakMins:60, days:'Mon–Sat', active:true  },
  { name:'Evening Shift',  code:'ES', start:'14:00', end:'23:00', breakMins:60, days:'Mon–Sat', active:true  },
  { name:'Night Shift',    code:'NS', start:'22:00', end:'07:00', breakMins:60, days:'Mon–Sun', active:false },
]

const GRADES = [
  { grade:'L1', band:'Junior',         minSalary:'₹3L',  maxSalary:'₹6L',  roles:['Junior Developer','Analyst','Executive'] },
  { grade:'L2', band:'Mid-Level',      minSalary:'₹6L',  maxSalary:'₹10L', roles:['Developer','Sr. Analyst'] },
  { grade:'L3', band:'Senior',         minSalary:'₹10L', maxSalary:'₹18L', roles:['Senior Developer','Lead'] },
  { grade:'L4', band:'Lead',           minSalary:'₹18L', maxSalary:'₹28L', roles:['Tech Lead','Principal Engineer'] },
  { grade:'M1', band:'Manager',        minSalary:'₹20L', maxSalary:'₹35L', roles:['Manager','Product Manager'] },
  { grade:'M2', band:'Senior Manager', minSalary:'₹35L', maxSalary:'₹55L', roles:['Sr. Manager','Group Manager'] },
]

const HR_POLICIES = [
  { name:'Leave Policy v2.0',          type:'Leave',      effective:'01 Jan 2024', status:'active'  },
  { name:'Work From Home Policy',      type:'Attendance', effective:'01 Apr 2023', status:'active'  },
  { name:'Anti-Harassment Policy',     type:'Conduct',    effective:'01 Jan 2023', status:'active'  },
  { name:'Travel & Expense Policy',    type:'Expense',    effective:'01 Jul 2023', status:'active'  },
  { name:'IT Security Policy',         type:'Security',   effective:'15 Feb 2024', status:'active'  },
  { name:'Performance Review Policy',  type:'Performance',effective:'01 Apr 2024', status:'draft'   },
]

const POLICY_COLORS = { Leave:'bg-emerald-100 text-emerald-700', Attendance:'bg-blue-100 text-blue-700', Conduct:'bg-violet-100 text-violet-700', Expense:'bg-amber-100 text-amber-700', Security:'bg-red-100 text-red-700', Performance:'bg-pink-100 text-pink-700' }

function Toggle2({ on }) {
  return (
    <div className={`w-8 h-4 rounded-full transition-colors cursor-pointer ${on ? 'bg-primary' : 'bg-slate-200'} relative`}>
      <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all ${on ? 'left-4' : 'left-0.5'}`}/>
    </div>
  )
}

export default function HRConfig() {
  const [tab, setTab] = useState('Employment Types')
  const [modal, setModal] = useState(false)

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border bg-white">
        <div>
          <h2 className="font-700 text-text-primary">HR Configuration</h2>
          <p className="text-xs text-text-muted">Manage employment types, shifts, grades and policies</p>
        </div>
        <button onClick={() => setModal(true)}
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
                {EMPLOYMENT_TYPES.map((et, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-600 text-text-primary">{et.name}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 bg-slate-100 text-text-secondary rounded font-600">{et.code}</span></td>
                    <td className="px-4 py-3 text-text-secondary">{et.notice}</td>
                    <td className="px-4 py-3 text-text-secondary">{et.probation}</td>
                    <td className="px-4 py-3"><Toggle2 on={et.active}/></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="text-text-muted hover:text-primary transition-colors"><Edit2 size={13}/></button>
                        <button className="text-text-muted hover:text-red-500 transition-colors"><Trash2 size={13}/></button>
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
            {SHIFTS.map((s, i) => (
              <div key={i} className="bg-white border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-700 text-text-primary">{s.name}</p>
                    <p className="text-[10px] text-text-muted">Code: {s.code}</p>
                  </div>
                  <Toggle2 on={s.active}/>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[['Start Time',s.start],['End Time',s.end],['Break',`${s.breakMins} min`],['Working Days',s.days]].map(([l,v]) => (
                    <div key={l} className="bg-slate-50 rounded-md p-2">
                      <p className="text-text-muted text-[10px]">{l}</p>
                      <p className="font-700 text-text-primary mt-0.5">{v}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 text-xs font-600 text-primary border border-primary/30 rounded-md py-1 hover:bg-primary/5 transition-colors">Edit</button>
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
                {GRADES.map((g, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3"><span className="px-2 py-0.5 bg-violet-100 text-violet-700 rounded font-700">{g.grade}</span></td>
                    <td className="px-4 py-3 font-600 text-text-primary">{g.band}</td>
                    <td className="px-4 py-3 text-text-secondary">{g.minSalary}</td>
                    <td className="px-4 py-3 text-text-secondary">{g.maxSalary}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {g.roles.map(r => <span key={r} className="px-1.5 py-0.5 bg-slate-100 text-text-muted rounded text-[9px]">{r}</span>)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="text-text-muted hover:text-primary transition-colors"><Edit2 size={13}/></button>
                        <button className="text-text-muted hover:text-red-500 transition-colors"><Trash2 size={13}/></button>
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
            {HR_POLICIES.map((p, i) => (
              <div key={i} className="bg-white border border-border rounded-lg p-4 flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-700 text-text-primary">{p.name}</p>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-700 ${POLICY_COLORS[p.type]}`}>{p.type}</span>
                    {p.status === 'draft' && <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-700">Draft</span>}
                  </div>
                  <p className="text-xs text-text-muted">Effective from: {p.effective}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-xs font-600 text-primary hover:underline">View</button>
                  <button className="text-xs font-600 text-text-secondary hover:text-primary border border-border px-2 py-1 rounded-md hover:border-primary/30 transition-colors">Edit</button>
                  <button className="text-text-muted hover:text-red-500 transition-colors"><Trash2 size={13}/></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={`Add ${tab.slice(0,-1)}`} size="sm">
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-600 text-text-primary mb-1.5">Name</label>
            <input className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"/>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setModal(false)} className="px-4 py-2 border border-border rounded-md text-sm font-600 text-text-secondary">Cancel</button>
            <button className="px-4 py-2 bg-primary text-white rounded-md text-sm font-600">Save</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}