import {
  CalendarOff,
  Clock,
  Receipt,
  FileText,
  UserPlus,
  HelpCircle,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ACTIONS = [
  {
    label: 'Apply Leave',
    icon: CalendarOff,
    path: '/leave/apply',
    color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100',
  },
  {
    label: 'Log Time',
    icon: Clock,
    path: '/projects/timesheets',
    color: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
  },
  {
    label: 'Submit Expense',
    icon: Receipt,
    path: '/expense',
    color: 'bg-violet-50 text-violet-600 hover:bg-violet-100',
  },
  {
    label: 'Raise Ticket',
    icon: HelpCircle,
    path: '/helpdesk/new',
    color: 'bg-pink-50 text-pink-600 hover:bg-pink-100',
  },
  {
    label: 'Add Employee',
    icon: UserPlus,
    path: '/core-hr/add',
    color: 'bg-amber-50 text-amber-600 hover:bg-amber-100',
  },
  {
    label: 'View Documents',
    icon: FileText,
    path: '/core-hr',
    color: 'bg-slate-100 text-slate-600 hover:bg-slate-200',
  },
]

export default function QuickActions() {
  const navigate = useNavigate()

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-800">
          Quick Actions
        </h3>

        <span className="text-xs font-medium text-slate-400">
          Shortcuts
        </span>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-3 gap-3">
        {ACTIONS.map((action) => {
          const Icon = action.icon

          return (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className={`
                flex flex-col items-center
                justify-center
                gap-2
                p-4
                rounded-xl
                text-center
                transition-all
                duration-200
                hover:shadow-sm
                hover:-translate-y-0.5
                ${action.color}
              `}
            >
              <Icon
                size={20}
                strokeWidth={2.3}
              />

              <span className="text-xs font-bold leading-tight">
                {action.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}