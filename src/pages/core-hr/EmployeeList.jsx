import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Download, MoreVertical, Mail, Phone, RefreshCw } from 'lucide-react'
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
      if (search)       params.search     = search
      if (dept)         params.department = dept
      const res = await employeeService.getAll(params)
      setEmployees(res.data?.employees || [])
      setTotal(res.data?.total || 0)
    } catch (err) {
      console.error('Failed to fetch employees:', err)
    } finally {
      setLoading(false)
    }
  }, [page, search, dept])

  // fetch departments for filter chips
  useEffect(() => {
    departmentService.getAll()
      .then(res => setDepts(res.data || []))
      .catch(() => {})
  }, [])

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchEmployees() }, 400)
    return () => clearTimeout(t)
  }, [search])

  // immediate fetch on dept/page change
  useEffect(() => { fetchEmployees() }, [dept, page])

  const handleDeptFilter = (deptId) => {
    setDept(deptId)
    setPage(1)
  }

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
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, ID or email…"
            className="w-full pl-8 pr-3 py-1.5 border border-border rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>

        {/* Dept filter chips from API */}
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => handleDeptFilter('')}
            className={`px-2.5 py-1 rounded-full text-xs font-600 transition-colors ${!dept ? 'bg-primary text-white' : 'bg-slate-100 text-text-secondary hover:bg-slate-200'}`}>
            All
          </button>
          {departments.map(d => (
            <button key={d._id} onClick={() => handleDeptFilter(d._id)}
              className={`px-2.5 py-1 rounded-full text-xs font-600 transition-colors ${dept === d._id ? 'bg-primary text-white' : 'bg-slate-100 text-text-secondary hover:bg-slate-200'}`}>
              {d.name}
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
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {employees.map(emp => (
              <div key={emp._id}
                onClick={() => navigate(`/core-hr/${emp._id}`)}
                className="bg-white border border-border rounded-lg p-4 cursor-pointer hover:shadow-card-hover hover:border-primary/30 transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <Avatar name={fullName(emp)} src={emp.avatar} size="md"/>
                  <Badge variant={STATUS_BADGE[emp.status]?.variant || 'gray'}>
                    {STATUS_BADGE[emp.status]?.label || emp.status}
                  </Badge>
                </div>
                <p className="text-sm font-700 text-text-primary group-hover:text-primary transition-colors">{fullName(emp)}</p>
                <p className="text-xs text-text-secondary mt-0.5">{emp.designation?.name || '—'}</p>
                <p className="text-[10px] text-text-muted mt-0.5">{emp.department?.name || '—'}</p>
                <div className="mt-3 pt-3 border-t border-border space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
                    <Mail size={10}/><span className="truncate">{emp.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
                    <Phone size={10}/><span>{emp.phone || '—'}</span>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] text-text-muted">{emp.employeeId}</span>
                  <span className="text-[10px] text-text-muted">{emp.location || '—'}</span>
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
                {employees.map(emp => (
                  <tr key={emp._id} onClick={() => navigate(`/core-hr/${emp._id}`)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={fullName(emp)} src={emp.avatar} size="sm"/>
                        <div>
                          <p className="font-600 text-text-primary">{fullName(emp)}</p>
                          <p className="text-text-muted">{emp.employeeId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{emp.department?.name || '—'}</td>
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
                ))}
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