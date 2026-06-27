import { useState, useEffect } from 'react'
import { ClipboardEdit, Plus, CheckCircle2, Clock, XCircle } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import Spinner from '@/components/ui/Spinner'
import Badge from '@/components/ui/Badge'
import { attendanceService } from '@/services/attendanceService'
import { useAuth } from '@/context/AuthContext'
import { formatDate } from '@/utils/formatDate'
import toast from 'react-hot-toast'

const EMPTY = { date:'', clockIn:'', clockOut:'', remarks:'' }

const t = (offset) => {
  const d = new Date(); d.setDate(d.getDate() - offset)
  return d.toISOString().slice(0,10)
}
const iso = (date, time) => `${date}T${time}:00.000Z`

const MOCK_LOGS = [
  {
    _id:'r1',
    employee:{ firstName:'Rahul', lastName:'Mehta', employeeId:'EMP001', avatar:'https://randomuser.me/api/portraits/men/32.jpg' },
    date: t(2), clockIn: iso(t(2),'09:15'), clockOut: iso(t(2),'18:30'),
    remarks:'Forgot to clock in — was in back-to-back client meetings all morning',
    isRegularized:true, regularizationStatus:'approved', hoursWorked:9.3,
  },
  {
    _id:'r2',
    employee:{ firstName:'Priya', lastName:'Sharma', employeeId:'EMP002', avatar:'https://randomuser.me/api/portraits/women/44.jpg' },
    date: t(4), clockIn: iso(t(4),'08:50'), clockOut: null,
    remarks:'System was down, clock-out not captured',
    isRegularized:true, regularizationStatus:'pending', hoursWorked:null,
  },
  {
    _id:'r3',
    employee:{ firstName:'Vikram', lastName:'Singh', employeeId:'EMP003', avatar:'https://randomuser.me/api/portraits/men/54.jpg' },
    date: t(7), clockIn: iso(t(7),'10:00'), clockOut: iso(t(7),'19:00'),
    remarks:'Biometric device failure — manually entered punch times',
    isRegularized:true, regularizationStatus:'approved', hoursWorked:9.0,
  },
  {
    _id:'r4',
    employee:{ firstName:'Anjali', lastName:'Patel', employeeId:'EMP004', avatar:'https://randomuser.me/api/portraits/women/68.jpg' },
    date: t(10), clockIn: null, clockOut: iso(t(10),'17:30'),
    remarks:'Remote work — forgot to mark clock-in on portal',
    isRegularized:true, regularizationStatus:'rejected', hoursWorked:null,
  },
  {
    _id:'r5',
    employee:{ firstName:'Sneha', lastName:'Gupta', employeeId:'EMP005', avatar:'https://randomuser.me/api/portraits/women/12.jpg' },
    date: t(1), clockIn: iso(t(1),'09:05'), clockOut: iso(t(1),'18:05'),
    remarks:'Network issue on mobile app — used web portal late',
    isRegularized:true, regularizationStatus:'pending', hoursWorked:9.0,
  },
]

const STATUS_CONFIG = {
  approved: { variant:'green',  label:'Approved', icon:CheckCircle2 },
  pending:  { variant:'yellow', label:'Pending',  icon:Clock        },
  rejected: { variant:'red',    label:'Rejected', icon:XCircle      },
}

function EmployeeAvatar({ employee }) {
  const [imgFailed, setImgFailed] = useState(false)
  const initials = `${employee?.firstName?.[0]||''}${employee?.lastName?.[0]||''}`
  if (employee?.avatar && !imgFailed) {
    return (
      <img
        src={employee.avatar}
        alt={`${employee.firstName} ${employee.lastName}`}
        className="w-9 h-9 rounded-full object-cover ring-1 ring-border shrink-0"
        onError={() => setImgFailed(true)}
      />
    )
  }
  return (
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-emerald-400 text-white text-xs font-700 flex items-center justify-center shrink-0">
      {initials}
    </div>
  )
}

export default function Regularization() {
  const { user } = useAuth()
  const [logs,   setLogs]   = useState([])
  const [loading,setLoading]= useState(true)
  const [modal,  setModal]  = useState(false)
  const [form,   setForm]   = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const res = await attendanceService.getLogs({ employee:user?._id, limit:30 })
      const fetched = (res.data?.logs||[]).filter(l => l.isRegularized)
      setLogs(fetched.length ? fetched : MOCK_LOGS)
    } catch {
      setLogs(MOCK_LOGS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchLogs() }, [])

  const handleSubmit = async () => {
    if (!form.date) return toast.error('Date is required')
    setSaving(true)
    try {
      await attendanceService.regularize({
        employee: user?._id, date: form.date,
        clockIn:  form.clockIn  ? `${form.date}T${form.clockIn}`  : undefined,
        clockOut: form.clockOut ? `${form.date}T${form.clockOut}` : undefined,
        remarks:  form.remarks,
      })
      toast.success('Regularization submitted')
      setModal(false); setForm(EMPTY); fetchLogs()
    } catch(err) {
      toast.error(err?.message||'Failed to submit')
    } finally {
      setSaving(false)
    }
  }

  const fmt = (iso) => iso ? new Date(iso).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}) : '—'

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border bg-white">
        <div>
          <h2 className="font-700 text-text-primary">Attendance Regularization</h2>
          <p className="text-xs text-text-muted mt-0.5">Request corrections for missed clock-ins/outs</p>
        </div>
        <button onClick={() => setModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-primary to-emerald-400 text-white rounded-md text-xs font-600 hover:opacity-90">
          <Plus size={13}/> New Request
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {loading
          ? <div className="flex items-center justify-center h-48"><Spinner size="lg"/></div>
          : logs.length === 0
          ? (
            <div className="flex flex-col items-center justify-center h-48 text-text-muted">
              <ClipboardEdit size={28} className="mb-2 opacity-30"/>
              <p className="text-sm">No regularization requests yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map(log => {
                const sc = STATUS_CONFIG[log.regularizationStatus] || STATUS_CONFIG.pending
                const Icon = sc.icon
                return (
                  <div key={log._id} className="bg-white border border-border rounded-xl p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
                    <EmployeeAvatar employee={log.employee} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-700 text-text-primary">
                          {log.employee?.firstName} {log.employee?.lastName}
                        </p>
                        <span className="text-xs text-text-muted">{log.employee?.employeeId}</span>
                      </div>
                      <p className="text-xs text-text-muted mt-0.5 truncate">{log.remarks || 'No remarks'}</p>
                    </div>
                    <div className="flex items-center gap-5 shrink-0">
                      <div className="text-center">
                        <p className="text-[10px] text-text-muted uppercase tracking-wide mb-0.5">Date</p>
                        <p className="text-xs font-600 text-text-secondary">{formatDate(log.date)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] text-text-muted uppercase tracking-wide mb-0.5">Clock In</p>
                        <p className="text-xs font-600 text-text-secondary">{fmt(log.clockIn)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] text-text-muted uppercase tracking-wide mb-0.5">Clock Out</p>
                        <p className="text-xs font-600 text-text-secondary">{fmt(log.clockOut)}</p>
                      </div>
                      {log.hoursWorked && (
                        <div className="text-center">
                          <p className="text-[10px] text-text-muted uppercase tracking-wide mb-0.5">Hours</p>
                          <p className="text-xs font-600 text-text-secondary">{log.hoursWorked}h</p>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Icon size={11} className="text-text-muted"/>
                        <Badge variant={sc.variant}>{sc.label}</Badge>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        }
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Request Regularization" size="sm">
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-600 text-text-primary mb-1.5">Date <span className="text-red-500">*</span></label>
            <input type="date" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))}
              className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"/>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-600 text-text-primary mb-1.5">Clock In</label>
              <input type="time" value={form.clockIn} onChange={e=>setForm(p=>({...p,clockIn:e.target.value}))}
                className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"/>
            </div>
            <div>
              <label className="block text-xs font-600 text-text-primary mb-1.5">Clock Out</label>
              <input type="time" value={form.clockOut} onChange={e=>setForm(p=>({...p,clockOut:e.target.value}))}
                className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"/>
            </div>
          </div>
          <div>
            <label className="block text-xs font-600 text-text-primary mb-1.5">Reason</label>
            <textarea rows={2} value={form.remarks} onChange={e=>setForm(p=>({...p,remarks:e.target.value}))}
              placeholder="e.g. Forgot to clock in due to client meeting"
              className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"/>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button onClick={() => setModal(false)} className="px-4 py-2 border border-border rounded-md text-sm font-600 text-text-secondary hover:bg-slate-50">Cancel</button>
            <button onClick={handleSubmit} disabled={saving} className="px-4 py-2 bg-primary text-white rounded-md text-sm font-600 hover:bg-primary-dark disabled:opacity-60 flex items-center gap-2">
              {saving && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"/>}Submit
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}