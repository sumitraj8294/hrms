import { useState, useEffect } from 'react'
import { Clock, CheckCircle2, XCircle, CalendarOff, Users, RefreshCw, LogIn, LogOut } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import Spinner from '@/components/ui/Spinner'
import { attendanceService } from '@/services/attendanceService'
import { useAuth } from '@/context/AuthContext'
import { formatDate, formatDateTime } from '@/utils/formatDate'
import toast from 'react-hot-toast'

const STATUS_MAP = {
  present: { label:'Present',  variant:'green',  icon:CheckCircle2 },
  absent:  { label:'Absent',   variant:'red',    icon:XCircle      },
  half_day:{ label:'Half Day', variant:'yellow', icon:Clock        },
  on_leave:{ label:'On Leave', variant:'purple', icon:CalendarOff  },
  holiday: { label:'Holiday',  variant:'blue',   icon:CalendarOff  },
  weekend: { label:'Weekend',  variant:'gray',   icon:CalendarOff  },
}

// Realistic sample avatar URLs (randomuser.me — stable, free, no auth)
const AVATARS = [
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/men/54.jpg',
  'https://randomuser.me/api/portraits/women/68.jpg',
  'https://randomuser.me/api/portraits/men/76.jpg',
  'https://randomuser.me/api/portraits/women/12.jpg',
  'https://randomuser.me/api/portraits/men/18.jpg',
  'https://randomuser.me/api/portraits/women/26.jpg',
]

const today = new Date()
const d = (offset) => {
  const dt = new Date(today)
  dt.setDate(dt.getDate() - offset)
  return dt.toISOString()
}

const MOCK_LOGS = [
  { _id:'1', employee:{ _id:'e1', firstName:'Rahul',   lastName:'Mehta',   employeeId:'EMP001', avatar:AVATARS[0] }, date:d(0), clockIn:d(0).replace('T00','T09').replace('Z','').replace(/\.\d+/,'')+'T09:02:00.000Z', clockOut:d(0).replace('T00','T18')+'T18:15:00.000Z', hoursWorked:9.2, status:'present', source:'web',     isRegularized:false },
  { _id:'2', employee:{ _id:'e2', firstName:'Priya',   lastName:'Sharma',  employeeId:'EMP002', avatar:AVATARS[1] }, date:d(0), clockIn:null, clockOut:null, hoursWorked:null, status:'on_leave', source:'—', isRegularized:false },
  { _id:'3', employee:{ _id:'e3', firstName:'Vikram',  lastName:'Singh',   employeeId:'EMP003', avatar:AVATARS[2] }, date:d(0), clockIn:`${d(0).slice(0,10)}T08:55:00.000Z`, clockOut:`${d(0).slice(0,10)}T18:00:00.000Z`, hoursWorked:9.1, status:'present', source:'biometric', isRegularized:false },
  { _id:'4', employee:{ _id:'e4', firstName:'Anjali',  lastName:'Patel',   employeeId:'EMP004', avatar:AVATARS[3] }, date:d(0), clockIn:`${d(0).slice(0,10)}T09:45:00.000Z`, clockOut:`${d(0).slice(0,10)}T14:00:00.000Z`, hoursWorked:4.3, status:'half_day', source:'web', isRegularized:false },
  { _id:'5', employee:{ _id:'e5', firstName:'Sneha',   lastName:'Gupta',   employeeId:'EMP005', avatar:AVATARS[4] }, date:d(0), clockIn:null, clockOut:null, hoursWorked:null, status:'absent', source:'—', isRegularized:false },
  { _id:'6', employee:{ _id:'e6', firstName:'Arjun',   lastName:'Nair',    employeeId:'EMP006', avatar:AVATARS[5] }, date:d(1), clockIn:`${d(1).slice(0,10)}T09:10:00.000Z`, clockOut:`${d(1).slice(0,10)}T18:30:00.000Z`, hoursWorked:9.3, status:'present', source:'mobile', isRegularized:false },
  { _id:'7', employee:{ _id:'e7', firstName:'Kavya',   lastName:'Reddy',   employeeId:'EMP007', avatar:AVATARS[6] }, date:d(1), clockIn:`${d(1).slice(0,10)}T10:00:00.000Z`, clockOut:`${d(1).slice(0,10)}T17:45:00.000Z`, hoursWorked:7.8, status:'present', source:'web', isRegularized:true  },
  { _id:'8', employee:{ _id:'e8', firstName:'Rohan',   lastName:'Joshi',   employeeId:'EMP008', avatar:AVATARS[7] }, date:d(1), clockIn:null, clockOut:null, hoursWorked:null, status:'absent', source:'—', isRegularized:false },
  { _id:'9', employee:{ _id:'e1', firstName:'Rahul',   lastName:'Mehta',   employeeId:'EMP001', avatar:AVATARS[0] }, date:d(1), clockIn:`${d(1).slice(0,10)}T08:58:00.000Z`, clockOut:`${d(1).slice(0,10)}T18:10:00.000Z`, hoursWorked:9.2, status:'present', source:'web', isRegularized:false },
  { _id:'10',employee:{ _id:'e3', firstName:'Vikram',  lastName:'Singh',   employeeId:'EMP003', avatar:AVATARS[2] }, date:d(2), clockIn:`${d(2).slice(0,10)}T09:30:00.000Z`, clockOut:`${d(2).slice(0,10)}T18:00:00.000Z`, hoursWorked:8.5, status:'present', source:'biometric', isRegularized:false },
]

const MOCK_STATS = { present:6, absent:2, onLeave:1, totalEmployees:9 }

export default function AttendanceLogs() {
  const { user } = useAuth()
  const [logs,    setLogs]    = useState([])
  const [stats,   setStats]   = useState(null)
  const [todayRec,setTodayRec]= useState(null)
  const [loading, setLoading] = useState(true)
  const [clocking,setClocking]= useState(false)

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [logsRes, statsRes, todayRes] = await Promise.all([
        attendanceService.getLogs({ limit:30 }),
        attendanceService.getStats(),
        attendanceService.getToday(user?._id),
      ])
      const fetchedLogs = logsRes.data?.logs || []
      setLogs(fetchedLogs.length ? fetchedLogs : MOCK_LOGS)
      setStats(statsRes.data?.present != null ? statsRes.data : MOCK_STATS)
      setTodayRec(todayRes.data)
    } catch {
      // API unavailable — use mock data
      setLogs(MOCK_LOGS)
      setStats(MOCK_STATS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const handleClockIn = async () => {
    setClocking(true)
    try { await attendanceService.clockIn({ employee:user?._id, source:'web' }); toast.success('Clocked in!'); fetchAll() }
    catch(err){ toast.error(err?.message||'Clock in failed') }
    finally { setClocking(false) }
  }

  const handleClockOut = async () => {
    setClocking(true)
    try { await attendanceService.clockOut({ employee:user?._id }); toast.success('Clocked out!'); fetchAll() }
    catch(err){ toast.error(err?.message||'Clock out failed') }
    finally { setClocking(false) }
  }

  // Parse time from ISO string for display
  const timeOnly = (iso) => {
    if (!iso) return '—'
    try {
      return new Date(iso).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', hour12:true })
    } catch { return '—' }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border bg-white">
        <div><h2 className="font-700 text-text-primary">Attendance Logs</h2><p className="text-xs text-text-muted mt-0.5">Track daily attendance and working hours</p></div>
        <div className="flex items-center gap-2">
          <button onClick={fetchAll} className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-md text-xs font-600 text-text-secondary hover:bg-slate-50"><RefreshCw size={13}/></button>
          {!todayRec?.clockIn ? (
            <button onClick={handleClockIn} disabled={clocking} className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 text-white rounded-md text-xs font-700 hover:opacity-90 disabled:opacity-50">
              <LogIn size={13}/>{clocking?'Clocking In...':'Clock In'}
            </button>
          ) : !todayRec?.clockOut ? (
            <button onClick={handleClockOut} disabled={clocking} className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-red-500 to-orange-400 text-white rounded-md text-xs font-700 hover:opacity-90 disabled:opacity-50">
              <LogOut size={13}/>{clocking?'Clocking Out...':'Clock Out'}
            </button>
          ) : <Badge variant="green">Day Complete ✓</Badge>}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 bg-gradient-to-b from-slate-50/50 to-transparent">
        {stats && (
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              {label:'Present Today',  value:stats.present,        grad:'from-emerald-500 to-teal-400', bg:'bg-emerald-50', text:'text-emerald-600', icon:CheckCircle2},
              {label:'Absent Today',   value:stats.absent,         grad:'from-red-500 to-rose-400',     bg:'bg-red-50',     text:'text-red-600',     icon:XCircle     },
              {label:'On Leave',       value:stats.onLeave,        grad:'from-amber-500 to-yellow-400', bg:'bg-amber-50',   text:'text-amber-600',   icon:CalendarOff },
              {label:'Total Employees',value:stats.totalEmployees, grad:'from-blue-500 to-cyan-400',    bg:'bg-blue-50',    text:'text-blue-600',    icon:Users       },
            ].map(s => { const Icon=s.icon; return (
              <div key={s.label} className="relative bg-white border border-border rounded-xl p-4 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${s.grad} opacity-[0.05]`}/>
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${s.grad}`}/>
                <div className={`relative w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center mb-2`}><Icon size={17} className={s.text}/></div>
                <p className="relative text-2xl font-800 text-text-primary">{s.value}</p>
                <p className="relative text-xs text-text-muted">{s.label}</p>
              </div>
            )})}
          </div>
        )}

        {loading ? <div className="flex items-center justify-center h-48"><Spinner size="lg"/></div> : (
          <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-border">
                  {['Employee','Date','Clock In','Clock Out','Hours','Status','Source'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-700 text-text-muted uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.map(log => {
                  const s = STATUS_MAP[log.status] || STATUS_MAP.present
                  const Icon = s.icon
                  return (
                    <tr key={log._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {log.employee?.avatar ? (
                            <img
                              src={log.employee.avatar}
                              alt={`${log.employee.firstName} ${log.employee.lastName}`}
                              className="w-7 h-7 rounded-full object-cover ring-1 ring-border"
                              onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }}
                            />
                          ) : null}
                          <span style={log.employee?.avatar ? {display:'none'} : {}}>
                            <Avatar name={`${log.employee?.firstName} ${log.employee?.lastName}`} size="sm"/>
                          </span>
                          <div>
                            <p className="font-600 text-text-primary">{log.employee?.firstName} {log.employee?.lastName}</p>
                            <p className="text-text-muted">{log.employee?.employeeId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-text-secondary">{formatDate(log.date)}</td>
                      <td className="px-4 py-3 text-text-secondary">{timeOnly(log.clockIn)}</td>
                      <td className="px-4 py-3 text-text-secondary">{timeOnly(log.clockOut)}</td>
                      <td className="px-4 py-3 font-600 text-text-primary">{log.hoursWorked ? `${log.hoursWorked}h` : '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Icon size={12} className="text-text-muted"/>
                          <Badge variant={s.variant}>{s.label}</Badge>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-text-secondary capitalize">
                        {log.source}{log.isRegularized && <span className="ml-1 text-[9px] text-amber-600">(Reg)</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {logs.length === 0 && (
              <div className="flex flex-col items-center py-12 text-text-muted">
                <Clock size={28} className="mb-2 opacity-30"/>
                <p className="text-sm">No attendance records found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}