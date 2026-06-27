import { useState, useEffect } from 'react'
import Spinner from '@/components/ui/Spinner'
import { shiftService } from '@/services/attendanceService'
import toast from 'react-hot-toast'

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const SHIFT_COLORS = {
  GS: 'bg-blue-100 text-blue-700 border-blue-200',
  MS: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  ES: 'bg-violet-100 text-violet-700 border-violet-200',
  NS: 'bg-slate-100 text-slate-700 border-slate-200',
}

const MOCK_SHIFTS = [
  { _id:'s1', code:'GS', name:'General Shift',  startTime:'09:00', endTime:'18:00' },
  { _id:'s2', code:'MS', name:'Morning Shift',  startTime:'06:00', endTime:'14:00' },
  { _id:'s3', code:'ES', name:'Evening Shift',  startTime:'14:00', endTime:'22:00' },
  { _id:'s4', code:'NS', name:'Night Shift',    startTime:'22:00', endTime:'06:00' },
]

const MOCK_ASSIGNMENTS = [
  { _id:'a1', shift:{ code:'GS', name:'General Shift' },  employee:{ firstName:'Rahul',  lastName:'Mehta',  employeeId:'EMP001', avatar:'https://randomuser.me/api/portraits/men/32.jpg'  }, overrides:{} },
  { _id:'a2', shift:{ code:'MS', name:'Morning Shift' },  employee:{ firstName:'Priya',  lastName:'Sharma', employeeId:'EMP002', avatar:'https://randomuser.me/api/portraits/women/44.jpg' }, overrides:{ Wed:'GS' } },
  { _id:'a3', shift:{ code:'ES', name:'Evening Shift' },  employee:{ firstName:'Vikram', lastName:'Singh',  employeeId:'EMP003', avatar:'https://randomuser.me/api/portraits/men/54.jpg'  }, overrides:{} },
  { _id:'a4', shift:{ code:'GS', name:'General Shift' },  employee:{ firstName:'Anjali', lastName:'Patel',  employeeId:'EMP004', avatar:'https://randomuser.me/api/portraits/women/68.jpg' }, overrides:{ Thu:'MS' } },
  { _id:'a5', shift:{ code:'NS', name:'Night Shift' },    employee:{ firstName:'Sneha',  lastName:'Gupta',  employeeId:'EMP005', avatar:'https://randomuser.me/api/portraits/women/12.jpg' }, overrides:{} },
  { _id:'a6', shift:{ code:'MS', name:'Morning Shift' },  employee:{ firstName:'Arjun',  lastName:'Nair',   employeeId:'EMP006', avatar:'https://randomuser.me/api/portraits/men/76.jpg'  }, overrides:{ Fri:'GS' } },
  { _id:'a7', shift:{ code:'GS', name:'General Shift' },  employee:{ firstName:'Kavya',  lastName:'Reddy',  employeeId:'EMP007', avatar:'https://randomuser.me/api/portraits/women/26.jpg' }, overrides:{} },
  { _id:'a8', shift:{ code:'ES', name:'Evening Shift' },  employee:{ firstName:'Rohan',  lastName:'Joshi',  employeeId:'EMP008', avatar:'https://randomuser.me/api/portraits/men/18.jpg'  }, overrides:{ Tue:'NS' } },
]

function EmpAvatar({ employee }) {
  const [failed, setFailed] = useState(false)
  const initials = `${employee?.firstName?.[0]||''}${employee?.lastName?.[0]||''}`
  if (employee?.avatar && !failed) {
    return (
      <img
        src={employee.avatar}
        alt={`${employee.firstName} ${employee.lastName}`}
        className="w-7 h-7 rounded-full object-cover ring-1 ring-border shrink-0"
        onError={() => setFailed(true)}
      />
    )
  }
  return (
    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-emerald-400 text-white text-[10px] font-700 flex items-center justify-center shrink-0">
      {initials}
    </div>
  )
}

export default function ShiftRoster() {
  const [shifts,      setShifts]      = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading,     setLoading]     = useState(true)

  useEffect(() => {
    Promise.all([shiftService.getShifts(), shiftService.getAssignments()])
      .then(([s, a]) => {
        setShifts((s.data||[]).length      ? s.data : MOCK_SHIFTS)
        setAssignments((a.data||[]).length ? a.data : MOCK_ASSIGNMENTS)
      })
      .catch(() => {
        setShifts(MOCK_SHIFTS)
        setAssignments(MOCK_ASSIGNMENTS)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border bg-white">
        <div>
          <h2 className="font-700 text-text-primary">Shift Roster</h2>
          <p className="text-xs text-text-muted mt-0.5">Weekly shift schedule across employees</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {loading
          ? <div className="flex items-center justify-center h-48"><Spinner size="lg"/></div>
          : (
          <>
            {/* Shift legend */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {shifts.map(s => (
                <span key={s._id} className={`px-2.5 py-1 rounded-full text-xs font-600 border ${SHIFT_COLORS[s.code]||'bg-slate-100 text-slate-600 border-slate-200'}`}>
                  {s.name} ({s.startTime}–{s.endTime})
                </span>
              ))}
            </div>

            <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-border">
                    <th className="text-left px-4 py-3 text-[10px] font-700 text-text-muted uppercase tracking-wide w-48">Employee</th>
                    {DAYS.map(d => (
                      <th key={d} className={`text-center px-3 py-3 text-[10px] font-700 uppercase tracking-wide ${d==='Sat'||d==='Sun' ? 'text-rose-300' : 'text-text-muted'}`}>{d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {assignments.length === 0
                    ? <tr><td colSpan={8} className="text-center py-10 text-text-muted text-sm">No shift assignments found</td></tr>
                    : assignments.map(a => {
                        const defaultCode = a.shift?.code || 'GS'
                        return (
                          <tr key={a._id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <EmpAvatar employee={a.employee} />
                                <div>
                                  <p className="font-600 text-text-primary">{a.employee?.firstName} {a.employee?.lastName}</p>
                                  <p className="text-text-muted">{a.employee?.employeeId}</p>
                                </div>
                              </div>
                            </td>
                            {DAYS.map(d => {
                              const isWeekend = d === 'Sat' || d === 'Sun'
                              const code = isWeekend ? null : (a.overrides?.[d] || defaultCode)
                              const cls  = SHIFT_COLORS[code] || 'bg-slate-100 text-slate-600 border-slate-200'
                              return (
                                <td key={d} className="px-2 py-3 text-center">
                                  {isWeekend
                                    ? <span className="text-[9px] text-rose-300 font-600">OFF</span>
                                    : <span className={`px-2 py-0.5 rounded-full text-[10px] font-700 border ${cls}`}>{code}</span>
                                  }
                                </td>
                              )
                            })}
                          </tr>
                        )
                      })
                  }
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}