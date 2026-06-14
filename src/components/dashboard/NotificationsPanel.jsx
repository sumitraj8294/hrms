import { useState } from 'react'
import { Bell, CheckCircle2, Clock, UserPlus, DollarSign, CalendarOff, X } from 'lucide-react'

const ALL_NOTIFS = [
  { id:1, type:'leave',     icon: CalendarOff, bg:'bg-amber-100',   ic:'text-amber-600',  title:'Leave request approved',        desc:'Your 2-day casual leave has been approved.',            time:'2m ago',  read: false },
  { id:2, type:'payroll',   icon: DollarSign,  bg:'bg-emerald-100', ic:'text-emerald-600',title:'May payslip generated',         desc:'Your payslip for May 2024 is now available.',           time:'1h ago',  read: false },
  { id:3, type:'hr',        icon: UserPlus,    bg:'bg-blue-100',    ic:'text-blue-600',   title:'New employee joined',           desc:'Ritika Sharma has joined the Engineering team.',        time:'3h ago',  read: false },
  { id:4, type:'approval',  icon: CheckCircle2,bg:'bg-violet-100',  ic:'text-violet-600', title:'Expense claim approved',        desc:'Your ₹3,200 travel claim has been reimbursed.',         time:'5h ago',  read: true  },
  { id:5, type:'reminder',  icon: Clock,       bg:'bg-pink-100',    ic:'text-pink-600',   title:'Appraisal deadline tomorrow',   desc:'Self-assessment for Q2 cycle is due by June 15.',      time:'1d ago',  read: true  },
]

export default function NotificationsPanel({ onClose }) {
  const [notifs, setNotifs] = useState(ALL_NOTIFS)
  const unread = notifs.filter(n => !n.read).length

  const markAll = () => setNotifs(n => n.map(x => ({ ...x, read: true })))
  const dismiss = (id) => setNotifs(n => n.filter(x => x.id !== id))

  return (
    <div className="w-80 bg-white border border-border rounded-xl shadow-card-hover flex flex-col max-h-[480px]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Bell size={15} className="text-text-primary"/>
          <span className="text-sm font-700 text-text-primary">Notifications</span>
          {unread > 0 && (
            <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-700 flex items-center justify-center">{unread}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unread > 0 && <button onClick={markAll} className="text-[10px] font-600 text-primary hover:underline">Mark all read</button>}
          {onClose && <button onClick={onClose} className="text-text-muted hover:text-text-primary"><X size={14}/></button>}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto divide-y divide-border">
        {notifs.map(n => {
          const Icon = n.icon
          return (
            <div key={n.id} className={`flex items-start gap-3 px-4 py-3 group transition-colors ${!n.read ? 'bg-primary/[0.03]' : 'hover:bg-surface-secondary'}`}>
              <div className={`w-8 h-8 rounded-full ${n.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <Icon size={14} className={n.ic}/>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-xs font-600 text-text-primary leading-snug ${!n.read ? 'font-700' : ''}`}>{n.title}</p>
                  <button onClick={() => dismiss(n.id)} className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-red-400 transition-all flex-shrink-0">
                    <X size={12}/>
                  </button>
                </div>
                <p className="text-[11px] text-text-secondary mt-0.5 leading-relaxed">{n.desc}</p>
                <p className="text-[10px] text-text-muted mt-1">{n.time}</p>
              </div>
              {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"/>}
            </div>
          )
        })}
      </div>

      <div className="px-4 py-2.5 border-t border-border text-center">
        <button className="text-xs font-600 text-primary hover:underline">View all notifications</button>
      </div>
    </div>
  )
}