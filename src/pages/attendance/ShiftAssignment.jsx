import { useState, useEffect } from 'react'
import { Plus, Trash2, RefreshCw } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import Spinner from '@/components/ui/Spinner'
import { shiftService } from '@/services/attendanceService'
import { employeeService } from '@/services/employeeService'
import { formatDate } from '@/utils/formatDate'
import toast from 'react-hot-toast'

const EMPTY = { employee:'', shift:'', fromDate:'', toDate:'' }

const SHIFT_COLORS = {
  GS: 'bg-blue-100 text-blue-700',
  MS: 'bg-emerald-100 text-emerald-700',
  ES: 'bg-violet-100 text-violet-700',
  NS: 'bg-slate-100 text-slate-700',
}

const d = (offset) => {
  const dt = new Date(); dt.setDate(dt.getDate() - offset)
  return dt.toISOString().slice(0,10)
}

const MOCK_SHIFTS = [
  { _id:'s1', code:'GS', name:'General Shift',  startTime:'09:00', endTime:'18:00' },
  { _id:'s2', code:'MS', name:'Morning Shift',  startTime:'06:00', endTime:'14:00' },
  { _id:'s3', code:'ES', name:'Evening Shift',  startTime:'14:00', endTime:'22:00' },
  { _id:'s4', code:'NS', name:'Night Shift',    startTime:'22:00', endTime:'06:00' },
]

const MOCK_EMPLOYEES = [
  { _id:'e1', firstName:'Rahul',  lastName:'Mehta',  employeeId:'EMP001' },
  { _id:'e2', firstName:'Priya',  lastName:'Sharma', employeeId:'EMP002' },
  { _id:'e3', firstName:'Vikram', lastName:'Singh',  employeeId:'EMP003' },
  { _id:'e4', firstName:'Anjali', lastName:'Patel',  employeeId:'EMP004' },
  { _id:'e5', firstName:'Sneha',  lastName:'Gupta',  employeeId:'EMP005' },
  { _id:'e6', firstName:'Arjun',  lastName:'Nair',   employeeId:'EMP006' },
  { _id:'e7', firstName:'Kavya',  lastName:'Reddy',  employeeId:'EMP007' },
  { _id:'e8', firstName:'Rohan',  lastName:'Joshi',  employeeId:'EMP008' },
]

const MOCK_ASSIGNMENTS = [
  { _id:'a1', employee:{ _id:'e1', firstName:'Rahul',  lastName:'Mehta',  employeeId:'EMP001', avatar:'https://randomuser.me/api/portraits/men/32.jpg'   }, shift:{ _id:'s1', code:'GS', name:'General Shift',  startTime:'09:00', endTime:'18:00' }, fromDate:d(30), toDate:null },
  { _id:'a2', employee:{ _id:'e2', firstName:'Priya',  lastName:'Sharma', employeeId:'EMP002', avatar:'https://randomuser.me/api/portraits/women/44.jpg'  }, shift:{ _id:'s2', code:'MS', name:'Morning Shift',  startTime:'06:00', endTime:'14:00' }, fromDate:d(25), toDate:d(5)  },
  { _id:'a3', employee:{ _id:'e3', firstName:'Vikram', lastName:'Singh',  employeeId:'EMP003', avatar:'https://randomuser.me/api/portraits/men/54.jpg'    }, shift:{ _id:'s3', code:'ES', name:'Evening Shift',  startTime:'14:00', endTime:'22:00' }, fromDate:d(20), toDate:null },
  { _id:'a4', employee:{ _id:'e4', firstName:'Anjali', lastName:'Patel',  employeeId:'EMP004', avatar:'https://randomuser.me/api/portraits/women/68.jpg'  }, shift:{ _id:'s1', code:'GS', name:'General Shift',  startTime:'09:00', endTime:'18:00' }, fromDate:d(15), toDate:null },
  { _id:'a5', employee:{ _id:'e5', firstName:'Sneha',  lastName:'Gupta',  employeeId:'EMP005', avatar:'https://randomuser.me/api/portraits/women/12.jpg'  }, shift:{ _id:'s4', code:'NS', name:'Night Shift',    startTime:'22:00', endTime:'06:00' }, fromDate:d(10), toDate:d(2)  },
  { _id:'a6', employee:{ _id:'e6', firstName:'Arjun',  lastName:'Nair',   employeeId:'EMP006', avatar:'https://randomuser.me/api/portraits/men/76.jpg'    }, shift:{ _id:'s2', code:'MS', name:'Morning Shift',  startTime:'06:00', endTime:'14:00' }, fromDate:d(8),  toDate:null },
  { _id:'a7', employee:{ _id:'e7', firstName:'Kavya',  lastName:'Reddy',  employeeId:'EMP007', avatar:'https://randomuser.me/api/portraits/women/26.jpg'  }, shift:{ _id:'s1', code:'GS', name:'General Shift',  startTime:'09:00', endTime:'18:00' }, fromDate:d(6),  toDate:null },
  { _id:'a8', employee:{ _id:'e8', firstName:'Rohan',  lastName:'Joshi',  employeeId:'EMP008', avatar:'https://randomuser.me/api/portraits/men/18.jpg'    }, shift:{ _id:'s3', code:'ES', name:'Evening Shift',  startTime:'14:00', endTime:'22:00' }, fromDate:d(3),  toDate:null },
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

export default function ShiftAssignment() {
  const [assignments, setAssignments] = useState([])
  const [employees,   setEmployees]   = useState([])
  const [shifts,      setShifts]      = useState([])
  const [loading,     setLoading]     = useState(true)
  const [modal,       setModal]       = useState(false)
  const [form,        setForm]        = useState(EMPTY)
  const [saving,      setSaving]      = useState(false)

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [a, e, s] = await Promise.all([
        shiftService.getAssignments(),
        employeeService.getAll({ limit:200 }),
        shiftService.getShifts(),
      ])
      setAssignments((a.data||[]).length          ? a.data             : MOCK_ASSIGNMENTS)
      setEmployees((e.data?.employees||[]).length  ? e.data.employees   : MOCK_EMPLOYEES)
      setShifts((s.data||[]).length               ? s.data             : MOCK_SHIFTS)
    } catch {
      setAssignments(MOCK_ASSIGNMENTS)
      setEmployees(MOCK_EMPLOYEES)
      setShifts(MOCK_SHIFTS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const handleSave = async () => {
    if (!form.employee || !form.shift || !form.fromDate) return toast.error('Employee, Shift and From Date required')
    setSaving(true)
    try {
      await shiftService.assignShift(form)
      toast.success('Shift assigned')
      setModal(false); setForm(EMPTY); fetchAll()
    } catch(err) {
      toast.error(err?.message||'Failed to assign')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try { await shiftService.deleteAssignment(id); toast.success('Removed'); fetchAll() }
    catch { toast.error('Failed to remove') }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border bg-white">
        <div>
          <h2 className="font-700 text-text-primary">Shift Assignment</h2>
          <p className="text-xs text-text-muted mt-0.5">Assign shifts to employees</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchAll} className="px-3 py-1.5 border border-border rounded-md text-xs font-600 text-text-secondary hover:bg-slate-50"><RefreshCw size={13}/></button>
          <button onClick={() => { setForm(EMPTY); setModal(true) }} className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-primary to-emerald-400 text-white rounded-md text-xs font-600 hover:opacity-90">
            <Plus size={13}/> Assign
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {loading
          ? <div className="flex items-center justify-center h-48"><Spinner size="lg"/></div>
          : (
          <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-border">
                  {['Employee','Shift','Start','End','From','To',''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-700 text-text-muted uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {assignments.length === 0
                  ? <tr><td colSpan={7} className="text-center py-10 text-text-muted text-sm">No assignments yet</td></tr>
                  : assignments.map(a => {
                      const shiftColor = SHIFT_COLORS[a.shift?.code] || 'bg-slate-100 text-slate-700'
                      const isOngoing  = !a.toDate
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
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full font-600 text-[10px] ${shiftColor}`}>{a.shift?.name}</span>
                          </td>
                          <td className="px-4 py-3 text-text-secondary">{a.shift?.startTime||'—'}</td>
                          <td className="px-4 py-3 text-text-secondary">{a.shift?.endTime||'—'}</td>
                          <td className="px-4 py-3 text-text-secondary">{formatDate(a.fromDate)}</td>
                          <td className="px-4 py-3">
                            {isOngoing
                              ? <span className="px-2 py-0.5 rounded-full text-[10px] font-600 bg-emerald-100 text-emerald-700">Ongoing</span>
                              : <span className="text-text-secondary">{formatDate(a.toDate)}</span>
                            }
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={() => handleDelete(a._id)} className="text-text-muted hover:text-red-500 transition-colors">
                              <Trash2 size={13}/>
                            </button>
                          </td>
                        </tr>
                      )
                    })
                }
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Assign Shift" size="sm">
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-600 text-text-primary mb-1.5">Employee *</label>
            <select value={form.employee} onChange={e=>setForm(p=>({...p,employee:e.target.value}))}
              className="w-full px-3 py-2 border border-border rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value="">Select Employee</option>
              {employees.map(e => <option key={e._id} value={e._id}>{e.firstName} {e.lastName} ({e.employeeId})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-600 text-text-primary mb-1.5">Shift *</label>
            <select value={form.shift} onChange={e=>setForm(p=>({...p,shift:e.target.value}))}
              className="w-full px-3 py-2 border border-border rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value="">Select Shift</option>
              {shifts.map(s => <option key={s._id} value={s._id}>{s.name} ({s.startTime}–{s.endTime})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-600 text-text-primary mb-1.5">From *</label>
              <input type="date" value={form.fromDate} onChange={e=>setForm(p=>({...p,fromDate:e.target.value}))}
                className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"/>
            </div>
            <div>
              <label className="block text-xs font-600 text-text-primary mb-1.5">To (optional)</label>
              <input type="date" value={form.toDate} onChange={e=>setForm(p=>({...p,toDate:e.target.value}))}
                className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"/>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setModal(false)} className="px-4 py-2 border border-border rounded-md text-sm font-600 text-text-secondary hover:bg-slate-50">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-primary text-white rounded-md text-sm font-600 hover:bg-primary-dark disabled:opacity-60 flex items-center gap-2">
              {saving && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"/>}Assign
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}