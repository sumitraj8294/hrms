import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, Plus, Download, MoreVertical, Mail, Phone, RefreshCw,
  Code2, Palette, TrendingUp, Wallet, Headphones, Megaphone, Scale, Settings2,
  MapPin, Calendar, Briefcase, Sparkles
} from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import Spinner from '@/components/ui/Spinner'
import { employeeService, departmentService } from '@/services/employeeService'
import { formatDate } from '@/utils/formatDate'

const STATUS_BADGE = {
  active:    { label:'Active',    variant:'green'  },
  on_leave:  { label:'On Leave',  variant:'yellow' },
  probation: { label:'Probation', variant:'purple' },
  inactive:  { label:'Inactive',  variant:'gray'   },
}

// Department → icon + gradient mapping (matches by keyword, case-insensitive)
const DEPT_STYLES = [
  { match:/engineer|tech|dev/i,        icon:Code2,      grad:'from-blue-500 to-cyan-400',     bg:'bg-blue-50',    text:'text-blue-600'   },
  { match:/design|ux|ui/i,             icon:Palette,    grad:'from-pink-500 to-rose-400',     bg:'bg-pink-50',    text:'text-pink-600'   },
  { match:/sales|business/i,           icon:TrendingUp, grad:'from-emerald-500 to-teal-400',  bg:'bg-emerald-50', text:'text-emerald-600'},
  { match:/finance|account/i,          icon:Wallet,     grad:'from-amber-500 to-yellow-400',  bg:'bg-amber-50',   text:'text-amber-600'  },
  { match:/hr|human/i,                 icon:Headphones, grad:'from-violet-500 to-purple-400', bg:'bg-violet-50',  text:'text-violet-600' },
  { match:/marketing/i,                icon:Megaphone,  grad:'from-orange-500 to-red-400',    bg:'bg-orange-50',  text:'text-orange-600' },
  { match:/legal/i,                    icon:Scale,      grad:'from-slate-600 to-slate-400',   bg:'bg-slate-100',  text:'text-slate-600'  },
  { match:/operation/i,                icon:Settings2,  grad:'from-indigo-500 to-blue-400',   bg:'bg-indigo-50',  text:'text-indigo-600' },
]

function getDeptStyle(deptName = '') {
  return DEPT_STYLES.find(s => s.match.test(deptName)) || {
    icon: Briefcase, grad:'from-slate-500 to-slate-400', bg:'bg-slate-100', text:'text-slate-600',
  }
}

export default function EmployeeList() {
  const navigate = useNavigate()
  const [employees, setEmployees]   = useState([])
  const [departments, setDepts]     = useState([])
  const [total, setTotal]           = useState(0)
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [dept, setDept]             = useState('')
  const [view, setView]             = useState('grid')
  const [page, setPage]             = useState(1)
  const limit = 20

  const fetchEmployees = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit }
      if (search) params.search     = search
      if (dept)   params.department = dept
      const res = await employeeService.getAll(params)
      setEmployees(res.data?.employees || [])
      setTotal(res.data?.total || 0)
    } catch (err) {
      console.error('Failed to fetch employees:', err)
    } finally {
      setLoading(false)
    }
  }, [page, search, dept])

  useEffect(() => {
    departmentService.getAll().then(res => setDepts(res.data || [])).catch(() => {})
  }, [])

  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchEmployees() }, 400)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => { fetchEmployees() }, [dept, page])

  const handleDeptFilter = (deptId) => { setDept(deptId); setPage(1) }
  const fullName = (emp) => `${emp.firstName} ${emp.lastName}`

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border bg-white">
        <div>
          <h2 className="font-700 text-text-primary">Employee Directory</h2>
          <p className="text-xs text-text-muted mt-0.5">{total} employees total</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchEmployees} className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-md text-xs font-600 text-text-secondary hover:bg-slate-50 transition-colors">
            <RefreshCw size={13}/> Refresh
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-md text-xs font-600 text-text-secondary hover:bg-slate-50 transition-colors">
            <Download size={13}/> Export
          </button>
          <button
            onClick={() => navigate('/core-hr/add')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-primary to-emerald-400 text-white rounded-md text-xs font-600 hover:opacity-90 transition-all shadow-sm"
          >
            <Plus size={13}/> Add Employee
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 px-5 py-3 bg-white border-b border-border flex-wrap">
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"/>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, ID or email…"
            className="w-full pl-8 pr-3 py-1.5 border border-border rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>

        {/* Dept filter chips with icons */}
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => handleDeptFilter('')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-600 transition-all ${!dept ? 'bg-gradient-to-r from-primary to-emerald-400 text-white shadow-sm' : 'bg-slate-100 text-text-secondary hover:bg-slate-200'}`}>
            <Sparkles size={11}/> All
          </button>
          {departments.map(d => {
            const style = getDeptStyle(d.name)
            const Icon  = style.icon
            const isActive = dept === d._id
            return (
              <button key={d._id} onClick={() => handleDeptFilter(d._id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-600 transition-all
                  ${isActive ? `bg-gradient-to-r ${style.grad} text-white shadow-sm` : 'bg-slate-100 text-text-secondary hover:bg-slate-200'}`}>
                <Icon size={11}/> {d.name}
              </button>
            )
          })}
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
      <div className="flex-1 overflow-y-auto p-5 bg-gradient-to-b from-slate-50/50 to-transparent">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Spinner size="lg"/>
          </div>
        ) : employees.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-text-muted">
            <Search size={32} className="mb-3 opacity-30"/>
            <p className="text-sm font-600">No employees found</p>
            <p className="text-xs mt-1">Try a different search or department filter</p>
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {employees.map(emp => {
              const style = getDeptStyle(emp.department?.name)
              const Icon  = style.icon
              return (
                <div key={emp._id}
                  onClick={() => navigate(`/core-hr/${emp._id}`)}
                  className={`relative rounded-xl p-4 cursor-pointer overflow-hidden border border-white/60
                    bg-gradient-to-br ${style.bg} via-white to-white
                    hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 group`}
                  style={{ backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))` }}
                >

                  {/* Soft gradient wash background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${style.grad} opacity-[0.06] group-hover:opacity-[0.1] transition-opacity`}/>

                  {/* Top gradient accent bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${style.grad}`}/>

                  {/* Glow blob top right */}
                  <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${style.grad} opacity-[0.12] blur-2xl group-hover:opacity-20 transition-opacity`}/>

                  {/* Glow blob bottom left */}
                  <div className={`absolute -bottom-8 -left-8 w-20 h-20 rounded-full bg-gradient-to-tr ${style.grad} opacity-[0.08] blur-2xl`}/>

                  <div className="relative flex items-start justify-between mb-3 z-10">
                    <div className="relative">
                      <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${style.grad} opacity-20 blur-md scale-110`}/>
                      <Avatar name={fullName(emp)} src={emp.avatar} size="md"/>
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br ${style.grad} flex items-center justify-center ring-2 ring-white shadow-sm`}>
                        <Icon size={10} className="text-white"/>
                      </div>
                    </div>
                    <Badge variant={STATUS_BADGE[emp.status]?.variant || 'gray'}>
                      {STATUS_BADGE[emp.status]?.label || emp.status}
                    </Badge>
                  </div>

                  <p className="relative z-10 text-sm font-700 text-text-primary group-hover:text-primary transition-colors">{fullName(emp)}</p>
                  <p className="relative z-10 text-xs text-text-secondary mt-0.5">{emp.designation?.name || '—'}</p>

                  <div className={`relative z-10 inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-white/70 backdrop-blur-sm border border-white shadow-sm`}>
                    <Icon size={10} className={style.text}/>
                    <span className={`text-[10px] font-600 ${style.text}`}>{emp.department?.name || 'Unassigned'}</span>
                  </div>

                  <div className="relative z-10 mt-3 pt-3 border-t border-white/60 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
                      <Mail size={10} className="flex-shrink-0"/><span className="truncate">{emp.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
                      <Phone size={10} className="flex-shrink-0"/><span>{emp.phone || '—'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
                      <MapPin size={10} className="flex-shrink-0"/><span>{emp.location || '—'}</span>
                    </div>
                  </div>

                  <div className="relative z-10 mt-2.5 pt-2.5 border-t border-white/60 flex items-center justify-between">
                    <span className="text-[10px] font-600 text-text-muted bg-white/70 backdrop-blur-sm px-1.5 py-0.5 rounded border border-white">{emp.employeeId}</span>
                    <div className="flex items-center gap-1 text-[10px] text-text-muted">
                      <Calendar size={9}/>
                      <span>{emp.joiningDate ? formatDate(emp.joiningDate) : '—'}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-border">
                  {['Employee','Department','Designation','Location','Joining Date','Type','Status',''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-700 text-text-muted uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {employees.map(emp => {
                  const style = getDeptStyle(emp.department?.name)
                  const Icon  = style.icon
                  return (
                    <tr key={emp._id} onClick={() => navigate(`/core-hr/${emp._id}`)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors group">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="relative">
                            <Avatar name={fullName(emp)} src={emp.avatar} size="sm"/>
                            <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-gradient-to-br ${style.grad} flex items-center justify-center ring-2 ring-white`}>
                              <Icon size={7} className="text-white"/>
                            </div>
                          </div>
                          <div>
                            <p className="font-600 text-text-primary group-hover:text-primary transition-colors">{fullName(emp)}</p>
                            <p className="text-text-muted">{emp.employeeId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${style.bg}`}>
                          <Icon size={10} className={style.text}/>
                          <span className={`font-600 ${style.text}`}>{emp.department?.name || '—'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-text-secondary">{emp.designation?.name || '—'}</td>
                      <td className="px-4 py-3 text-text-secondary">{emp.location || '—'}</td>
                      <td className="px-4 py-3 text-text-secondary">{emp.joiningDate ? formatDate(emp.joiningDate) : '—'}</td>
                      <td className="px-4 py-3 text-text-secondary">{emp.employmentType || '—'}</td>
                      <td className="px-4 py-3">
                        <Badge variant={STATUS_BADGE[emp.status]?.variant || 'gray'}>
                          {STATUS_BADGE[emp.status]?.label || emp.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={e => e.stopPropagation()} className="text-text-muted hover:text-primary transition-colors">
                          <MoreVertical size={14}/>
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {total > limit && !loading && (
          <div className="flex items-center justify-between mt-4 px-1">
            <p className="text-xs text-text-muted">
              Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
            </p>
            <div className="flex gap-1.5">
              <button onClick={() => setPage(p => p - 1)} disabled={page === 1}
                className="px-3 py-1.5 border border-border rounded-md text-xs font-600 disabled:opacity-40 hover:bg-slate-50 transition-colors">
                ← Prev
              </button>
              <button onClick={() => setPage(p => p + 1)} disabled={page * limit >= total}
                className="px-3 py-1.5 border border-border rounded-md text-xs font-600 disabled:opacity-40 hover:bg-slate-50 transition-colors">
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}