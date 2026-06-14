import { Users, Clock, CalendarOff, UserPlus, DollarSign, TrendingDown } from 'lucide-react'

const kpis = [
  { label: 'Total Employees', value: '248',     change: '+12 this month', up: true,  icon: Users,        bg: 'bg-violet-50', ic: 'text-violet-600' },
  { label: 'Present Today',   value: '196',     change: '79% attendance', up: true,  icon: Clock,        bg: 'bg-emerald-50',ic: 'text-emerald-600' },
  { label: 'On Leave',        value: '18',      change: '-3 vs yesterday',up: false, icon: CalendarOff,  bg: 'bg-amber-50',  ic: 'text-amber-600' },
  { label: 'Open Positions',  value: '7',       change: '+2 this week',   up: true,  icon: UserPlus,     bg: 'bg-blue-50',   ic: 'text-blue-600' },
  { label: 'Monthly Payroll', value: '₹24.6L',  change: 'Disbursed',      up: true,  icon: DollarSign,   bg: 'bg-pink-50',   ic: 'text-pink-600' },
  { label: 'Attrition Rate',  value: '3.2%',    change: '-0.4% this qtr', up: false, icon: TrendingDown, bg: 'bg-red-50',    ic: 'text-red-500' },
]

export default function KPIWidgets() {
  return (
    <div className="grid grid-cols-3 gap-3 mb-3">
      {kpis.map(k => {
        const Icon = k.icon
        return (
          <div key={k.label} className="bg-white border border-border rounded-lg p-3 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg ${k.bg} flex items-center justify-center flex-shrink-0`}>
              <Icon size={17} className={k.ic}/>
            </div>
            <div className="min-w-0">
              <p className="text-lg font-800 text-text-primary leading-none">{k.value}</p>
              <p className="text-[10px] text-text-muted mt-0.5 truncate">{k.label}</p>
              <p className={`text-[10px] font-600 mt-0.5 ${k.up ? 'text-emerald-600' : 'text-red-500'}`}>{k.change}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}