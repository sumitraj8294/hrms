import {
  Users,
  Clock,
  CalendarOff,
  UserPlus,
  DollarSign,
  TrendingDown,
} from 'lucide-react'

import totalEmployeesImg from '../../assets/dashboard/welcome.png'
import presentTodayImg from '../../assets/dashboard/present.png'
import onLeaveImg from '../../assets/dashboard/leave.png'
import openPositionsImg from '../../assets/dashboard/openposition.png'
import payrollImg from '../../assets/dashboard/payroll.png'
import attritionImg from '../../assets/dashboard/attrition.png'

const kpis = [
  {
    label: 'Total Employees',
    value: '248',
    change: '+12 this month',
    up: true,
    icon: Users,
    img: totalEmployeesImg,
    bg: 'bg-violet-50',
    ic: 'text-violet-600',
    highlight: true,
  },
  {
    label: 'Present Today',
    value: '196',
    change: '79% attendance',
    up: true,
    icon: Clock,
    img: presentTodayImg,
    bg: 'bg-emerald-50',
    ic: 'text-emerald-600',
  },
  {
    label: 'On Leave',
    value: '18',
    change: '-3 vs yesterday',
    up: false,
    icon: CalendarOff,
    img: onLeaveImg,
    bg: 'bg-amber-50',
    ic: 'text-amber-600',
  },
  {
    label: 'Open Positions',
    value: '7',
    change: '+2 this week',
    up: true,
    icon: UserPlus,
    img: openPositionsImg,
    bg: 'bg-blue-50',
    ic: 'text-blue-600',
  },
  {
    label: 'Monthly Payroll',
    value: '₹24.6L',
    change: 'Disbursed',
    up: true,
    icon: DollarSign,
    img: payrollImg,
    bg: 'bg-pink-50',
    ic: 'text-pink-600',
    highlight: true,
  },
  {
    label: 'Attrition Rate',
    value: '3.2%',
    change: '-0.4% this qtr',
    up: false,
    icon: TrendingDown,
    img: attritionImg,
    bg: 'bg-red-50',
    ic: 'text-red-500',
  },
]

export default function KPIWidgets() {
  return (
    <div className="grid grid-cols-3 gap-4 mb-4">
      {kpis.map((k) => {
        const Icon = k.icon

        return (
          <div
            key={k.label}
            className={`
              bg-white
              rounded-2xl
              p-4
              flex items-center
              gap-4
              shadow-sm
              hover:shadow-xl
              hover:-translate-y-1
              transition-all
              duration-300
              cursor-pointer
              relative
              overflow-hidden
              ${
                k.highlight
                  ? 'border border-violet-200 ring-1 ring-violet-100'
                  : 'border border-slate-200 hover:border-violet-200'
              }
            `}
          >
            {/* Icon */}
            <div
              className={`
                w-12 h-12
                rounded-xl
                ${k.bg}
                flex items-center
                justify-center
                flex-shrink-0
                shadow-sm
              `}
            >
              <Icon size={22} className={k.ic} />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <p
                className={`
                  text-2xl
                  font-extrabold
                  leading-none
                  ${
                    k.highlight
                      ? 'text-violet-700'
                      : 'text-slate-900'
                  }
                `}
              >
                {k.value}
              </p>

              <p className="text-xs font-semibold text-slate-500 mt-1 truncate">
                {k.label}
              </p>

              <p
                className={`
                  text-xs
                  font-bold
                  mt-1
                  ${
                    k.up
                      ? 'text-emerald-600'
                      : 'text-red-500'
                  }
                `}
              >
                {k.change}
              </p>
            </div>

            {/* Right-side image */}
            {k.img && (
              <img
                src={k.img}
                alt=""
                className="w-16 h-16 object-contain flex-shrink-0 opacity-90"
              />
            )}
          </div>
        )
      })}
    </div>
  )
}