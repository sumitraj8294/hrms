import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Edit2, Mail, Phone, MapPin, Calendar, Briefcase, Building2, FileText, Clock, TrendingUp, Award, ChevronRight } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'

const PROFILE = {
  id:1, empId:'EMP001', name:'Priya Sharma', designation:'Senior Developer', dept:'Engineering',
  email:'priya@nexhr.com', phone:'9876543210', location:'Bangalore', joining:'12 Jan 2022',
  dob:'15 Mar 1994', gender:'Female', type:'Full-Time', status:'active', manager:'Raj Mehta',
  grade:'L4', band:'Senior', costCenter:'CC-ENG-01', probationEnd:'12 Apr 2022',
  address:'#42, 3rd Cross, Indiranagar, Bangalore - 560038',
  skills:['React','Node.js','TypeScript','MongoDB','AWS'],
  timeline:[
    { date:'12 Jan 2022', event:'Joined as Junior Developer',      type:'join'      },
    { date:'01 Apr 2023', event:'Promoted to Senior Developer',    type:'promotion' },
    { date:'15 Jun 2023', event:'Transferred to Core Product Team',type:'transfer'  },
    { date:'01 Jan 2024', event:'Salary Revision – Grade L4',      type:'revision'  },
  ],
  documents:[
    { name:'Offer Letter',       date:'10 Jan 2022', status:'verified' },
    { name:'ID Proof (Aadhar)',  date:'12 Jan 2022', status:'verified' },
    { name:'Education Certificates', date:'12 Jan 2022', status:'verified' },
    { name:'Contract Agreement', date:'12 Jan 2022', status:'pending'  },
  ],
}

const TABS = ['Overview','Timeline','Documents','Payroll','Leave','Performance']

const EVENT_COLORS = { join:'bg-emerald-500', promotion:'bg-violet-500', transfer:'bg-blue-500', revision:'bg-amber-500' }

export default function EmployeeProfile() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('Overview')
  const emp = PROFILE

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-4 pb-3 border-b border-border bg-white">
        <button onClick={() => navigate('/core-hr')} className="text-text-muted hover:text-primary transition-colors">
          <ArrowLeft size={18}/>
        </button>
        <div className="flex items-center gap-3 flex-1">
          <Avatar name={emp.name} size="md"/>
          <div>
            <h2 className="font-700 text-text-primary">{emp.name}</h2>
            <p className="text-xs text-text-muted">{emp.empId} · {emp.designation} · {emp.dept}</p>
          </div>
          <Badge variant="green" className="ml-2">Active</Badge>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-md text-xs font-600 text-text-secondary hover:bg-slate-50 transition-colors">
          <Edit2 size={13}/> Edit Profile
        </button>
      </div>

      {/* Tabs */}
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
        {tab === 'Overview' && (
          <div className="grid grid-cols-3 gap-4">
            {/* Personal Info */}
            <div className="bg-white border border-border rounded-lg p-4">
              <p className="text-xs font-700 text-text-muted uppercase tracking-wide mb-3">Personal Information</p>
              <div className="space-y-3">
                {[
                  { icon:Mail,       label:'Email',    value:emp.email      },
                  { icon:Phone,      label:'Phone',    value:emp.phone      },
                  { icon:MapPin,     label:'Location', value:emp.location   },
                  { icon:Calendar,   label:'DOB',      value:emp.dob        },
                  { icon:MapPin,     label:'Address',  value:emp.address    },
                ].map(f => {
                  const Icon = f.icon
                  return (
                    <div key={f.label} className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-md bg-slate-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon size={13} className="text-text-muted"/>
                      </div>
                      <div>
                        <p className="text-[10px] text-text-muted">{f.label}</p>
                        <p className="text-xs font-600 text-text-primary">{f.value}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Employment Info */}
            <div className="bg-white border border-border rounded-lg p-4">
              <p className="text-xs font-700 text-text-muted uppercase tracking-wide mb-3">Employment Details</p>
              <div className="space-y-3">
                {[
                  { icon:Briefcase,  label:'Employment Type', value:emp.type        },
                  { icon:Building2,  label:'Department',      value:emp.dept        },
                  { icon:Award,      label:'Grade / Band',    value:`${emp.grade} / ${emp.band}` },
                  { icon:Calendar,   label:'Joining Date',    value:emp.joining     },
                  { icon:TrendingUp, label:'Reporting To',    value:emp.manager     },
                  { icon:FileText,   label:'Cost Center',     value:emp.costCenter  },
                ].map(f => {
                  const Icon = f.icon
                  return (
                    <div key={f.label} className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-md bg-slate-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon size={13} className="text-text-muted"/>
                      </div>
                      <div>
                        <p className="text-[10px] text-text-muted">{f.label}</p>
                        <p className="text-xs font-600 text-text-primary">{f.value}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Skills + Quick links */}
            <div className="space-y-4">
              <div className="bg-white border border-border rounded-lg p-4">
                <p className="text-xs font-700 text-text-muted uppercase tracking-wide mb-3">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {emp.skills.map(s => (
                    <span key={s} className="px-2 py-0.5 bg-primary/10 text-primary text-[11px] font-600 rounded-full">{s}</span>
                  ))}
                </div>
              </div>
              <div className="bg-white border border-border rounded-lg p-4">
                <p className="text-xs font-700 text-text-muted uppercase tracking-wide mb-3">Quick Summary</p>
                <div className="space-y-2">
                  {[
                    { label:'Tenure',          value:'2 yrs 5 months' },
                    { label:'Probation Ended', value:emp.probationEnd },
                    { label:'Leave Balance',   value:'12 days'        },
                    { label:'Last Appraisal',  value:'Mar 2024 · 4.5' },
                  ].map(r => (
                    <div key={r.label} className="flex justify-between">
                      <span className="text-xs text-text-muted">{r.label}</span>
                      <span className="text-xs font-600 text-text-primary">{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'Timeline' && (
          <div className="max-w-xl">
            <p className="text-xs font-700 text-text-muted uppercase tracking-wide mb-4">Employee Lifecycle</p>
            <div className="relative pl-6 space-y-6">
              <div className="absolute left-2.5 top-0 bottom-0 w-px bg-border"/>
              {emp.timeline.map((t, i) => (
                <div key={i} className="relative">
                  <div className={`absolute -left-6 top-1 w-3 h-3 rounded-full ${EVENT_COLORS[t.type]} ring-2 ring-white`}/>
                  <div className="bg-white border border-border rounded-lg p-3">
                    <p className="text-xs font-700 text-text-primary">{t.event}</p>
                    <p className="text-[10px] text-text-muted mt-0.5">{t.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'Documents' && (
          <div className="max-w-2xl">
            <div className="bg-white border border-border rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-border">
                    {['Document','Uploaded','Status','Action'].map(h => (
                      <th key={h} className="text-left px-4 py-2.5 text-[10px] font-700 text-text-muted uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {emp.documents.map((d,i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <FileText size={14} className="text-text-muted"/>
                          <span className="font-600 text-text-primary">{d.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-text-secondary">{d.date}</td>
                      <td className="px-4 py-3">
                        <Badge variant={d.status === 'verified' ? 'green' : 'yellow'}>
                          {d.status === 'verified' ? 'Verified' : 'Pending'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-xs font-600 text-primary hover:underline">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {['Payroll','Leave','Performance'].includes(tab) && (
          <div className="flex items-center justify-center h-48 text-text-muted text-sm">
            {tab} details coming soon…
          </div>
        )}
      </div>
    </div>
  )
}