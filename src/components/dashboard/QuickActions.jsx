import { CalendarOff, Clock, Receipt, FileText, UserPlus, HelpCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ACTIONS = [
  { label: 'Apply Leave',      icon: CalendarOff, path: '/leave/apply',       color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' },
  { label: 'Log Time',         icon: Clock,       path: '/projects/timesheets',color: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
  { label: 'Submit Expense',   icon: Receipt,     path: '/expense',            color: 'bg-violet-50 text-violet-600 hover:bg-violet-100' },
  { label: 'Raise Ticket',     icon: HelpCircle,  path: '/helpdesk/new',       color: 'bg-pink-50 text-pink-600 hover:bg-pink-100' },
  { label: 'Add Employee',     icon: UserPlus,    path: '/core-hr/add',        color: 'bg-amber-50 text-amber-600 hover:bg-amber-100' },
  { label: 'View Documents',   icon: FileText,    path: '/core-hr',            color: 'bg-slate-100 text-slate-600 hover:bg-slate-200' },
]

export default function QuickActions() {
  const navigate = useNavigate()
  return (
    <div className="bg-white border border-border rounded-lg p-4">
      <p className="text-sm font-600 text-text-primary mb-3">Quick Actions</p>
      <div className="grid grid-cols-3 gap-2">
        {ACTIONS.map(a => {
          const Icon = a.icon
          return (
            <button
              key={a.label}
              onClick={() => navigate(a.path)}
              className={`flex flex-col items-center gap-1.5 p-2.5 rounded-lg text-center transition-colors ${a.color}`}
            >
              <Icon size={16}/>
              <span className="text-[10px] font-600 leading-tight">{a.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}