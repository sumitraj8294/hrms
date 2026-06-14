import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Filter, Download, MoreVertical, Mail, Phone } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'

const EMPLOYEES = [
  { id:1, empId:'EMP001', name:'Priya Sharma',   email:'priya@nexhr.com',   phone:'9876543210', dept:'Engineering', designation:'Sr. Developer',   status:'active',     type:'Full-Time', joining:'12 Jan 2022', location:'Bangalore' },
  { id:2, empId:'EMP002', name:'Rahul Verma',    email:'rahul@nexhr.com',   phone:'9876543211', dept:'Sales',       designation:'Sales Executive', status:'active',     type:'Full-Time', joining:'05 Mar 2023', location:'Mumbai'    },
  { id:3, empId:'EMP003', name:'Anita Roy',      email:'anita@nexhr.com',   phone:'9876543212', dept:'HR',          designation:'HR Manager',      status:'on_leave',   type:'Full-Time', joining:'20 Jun 2021', location:'Delhi'     },
  { id:4, empId:'EMP004', name:'Siddharth K.',   email:'sid@nexhr.com',     phone:'9876543213', dept:'Engineering', designation:'Backend Dev',     status:'active',     type:'Full-Time', joining:'01 Sep 2023', location:'Bangalore' },
  { id:5, empId:'EMP005', name:'Kavya Nair',     email:'kavya@nexhr.com',   phone:'9876543214', dept:'Design',      designation:'UI/UX Designer',  status:'probation',  type:'Full-Time', joining:'15 Nov 2023', location:'Pune'      },
  { id:6, empId:'EMP006', name:'Arjun Singh',    email:'arjun@nexhr.com',   phone:'9876543215', dept:'Finance',     designation:'Finance Analyst', status:'active',     type:'Full-Time', joining:'10 Apr 2022', location:'Hyderabad' },
  { id:7, empId:'EMP007', name:'Neha Kapoor',    email:'neha@nexhr.com',    phone:'9876543216', dept:'Marketing',   designation:'Marketing Lead',  status:'active',     type:'Full-Time', joining:'22 Feb 2021', location:'Mumbai'    },
  { id:8, empId:'EMP008', name:'Ravi Kumar',     email:'ravi@nexhr.com',    phone:'9876543217', dept:'Operations',  designation:'Ops Executive',   status:'inactive',   type:'Contract',  joining:'03 Aug 2023', location:'Chennai'   },
]

const STATUS_BADGE = {
  active:    { label:'Active',    variant:'green'  },
  on_leave:  { label:'On Leave',  variant:'yellow' },
  probation: { label:'Probation', variant:'purple' },
  inactive:  { label:'Inactive',  variant:'gray'   },
}

const DEPT_FILTERS = ['All','Engineering','Sales','HR','Design','Finance','Marketing','Operations']

export default function EmployeeList() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [dept, setDept]     = useState('All')
  const [view, setView]     = useState('grid') // grid | table

  const filtered = EMPLOYEES.filter(e =>
    (dept === 'All' || e.dept === dept) &&
    (e.name.toLowerCase().includes(search.toLowerCase()) ||
     e.empId.toLowerCase().includes(search.toLowerCase()) ||
     e.email.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border bg-white">
        <div>
          <h2 className="font-700 text-text-primary">Employee Directory</h2>
          <p className="text-xs text-text-muted mt-0.5">{EMPLOYEES.length} employees total</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-md text-xs font-600 text-text-secondary hover:bg-slate-50 transition-colors">
            <Download size={13}/> Export
          </button>
          <button
            onClick={() => navigate('/core-hr/add')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-md text-xs font-600 hover:bg-primary-dark transition-colors"
          >
            <Plus size={13}/> Add Employee
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 px-5 py-3 bg-white border-b border-border flex-wrap">
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"/>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, ID or email…"
            className="w-full pl-8 pr-3 py-1.5 border border-border rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"/>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {DEPT_FILTERS.map(d => (
            <button key={d} onClick={() => setDept(d)}
              className={`px-2.5 py-1 rounded-full text-xs font-600 transition-colors ${dept === d ? 'bg-primary text-white' : 'bg-slate-100 text-text-secondary hover:bg-slate-200'}`}>
              {d}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-1 border border-border rounded-md overflow-hidden">
          {['grid','table'].map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-2.5 py-1.5 text-xs font-600 transition-colors ${view === v ? 'bg-primary text-white' : 'text-text-muted hover:bg-slate-50'}`}>
              {v === 'grid' ? '⊞' : '☰'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {view === 'grid' ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map(emp => (
              <div key={emp.id}
                onClick={() => navigate(`/core-hr/${emp.id}`)}
                className="bg-white border border-border rounded-lg p-4 cursor-pointer hover:shadow-card-hover hover:border-primary/30 transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <Avatar name={emp.name} size="md"/>
                  <Badge variant={STATUS_BADGE[emp.status].variant}>{STATUS_BADGE[emp.status].label}</Badge>
                </div>
                <p className="text-sm font-700 text-text-primary group-hover:text-primary transition-colors">{emp.name}</p>
                <p className="text-xs text-text-secondary mt-0.5">{emp.designation}</p>
                <p className="text-[10px] text-text-muted mt-0.5">{emp.dept}</p>
                <div className="mt-3 pt-3 border-t border-border space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
                    <Mail size={10}/><span className="truncate">{emp.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
                    <Phone size={10}/><span>{emp.phone}</span>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] text-text-muted">{emp.empId}</span>
                  <span className="text-[10px] text-text-muted">{emp.location}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-border rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-border">
                  {['Employee','Department','Designation','Location','Joining Date','Type','Status',''].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-[10px] font-700 text-text-muted uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(emp => (
                  <tr key={emp.id} onClick={() => navigate(`/core-hr/${emp.id}`)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={emp.name} size="sm"/>
                        <div>
                          <p className="font-600 text-text-primary">{emp.name}</p>
                          <p className="text-text-muted">{emp.empId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{emp.dept}</td>
                    <td className="px-4 py-3 text-text-secondary">{emp.designation}</td>
                    <td className="px-4 py-3 text-text-secondary">{emp.location}</td>
                    <td className="px-4 py-3 text-text-secondary">{emp.joining}</td>
                    <td className="px-4 py-3 text-text-secondary">{emp.type}</td>
                    <td className="px-4 py-3"><Badge variant={STATUS_BADGE[emp.status].variant}>{STATUS_BADGE[emp.status].label}</Badge></td>
                    <td className="px-4 py-3">
                      <button className="text-text-muted hover:text-primary transition-colors"><MoreVertical size={14}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-text-muted">
            <Search size={32} className="mb-3 opacity-30"/>
            <p className="text-sm">No employees found</p>
          </div>
        )}
      </div>
    </div>
  )
}