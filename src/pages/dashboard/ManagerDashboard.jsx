import { useState } from 'react'
import { Bell, Users } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

import NotificationsPanel from '@/components/dashboard/NotificationsPanel'
import QuickActions       from '@/components/dashboard/QuickActions'
import PendingApprovals   from '@/components/dashboard/PendingApprovals'
import AttendanceSummary  from '@/components/dashboard/AttendanceSummary'
import LeaveSummary       from '@/components/dashboard/LeaveSummary'
import CompanyFeed        from '@/components/dashboard/CompanyFeed'
import Avatar             from '@/components/ui/Avatar'

const teamMembers = [
  { name:'Priya Sharma', role:'Senior Dev',    status:'present', hours:'7h 20m' },
  { name:'Rahul Verma',  role:'Frontend Dev',  status:'wfh',     hours:'6h 10m' },
  { name:'Anita Roy',    role:'QA Engineer',   status:'leave',   hours:'—'      },
  { name:'Siddharth K.', role:'Backend Dev',   status:'present', hours:'8h 05m' },
  { name:'Kavya Nair',   role:'UI/UX Designer',status:'present', hours:'5h 50m' },
]

const STATUS = {
  present: { label:'Present', cls:'bg-emerald-100 text-emerald-700' },
  wfh:     { label:'WFH',     cls:'bg-blue-100 text-blue-700'       },
  leave:   { label:'On Leave',cls:'bg-amber-100 text-amber-700'     },
  absent:  { label:'Absent',  cls:'bg-red-100 text-red-500'         },
}

export default function ManagerDashboard() {
  const { user } = useAuth()
  const [showNotif, setShowNotif] = useState(false)

  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-y-auto">

        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <div>
            <h2 className="font-700 text-text-primary">Manager Dashboard</h2>
            <p className="text-xs text-text-muted">Good morning, {user?.name?.split(' ')[0]} 👋</p>
          </div>
          <div className="relative">
            <button onClick={() => setShowNotif(v => !v)}
              className="relative w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center text-text-secondary hover:text-primary transition-colors">
              <Bell size={15}/>
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full"/>
            </button>
            {showNotif && (
              <div className="absolute right-0 top-10 z-50">
                <NotificationsPanel onClose={() => setShowNotif(false)}/>
              </div>
            )}
          </div>
        </div>

        <div className="px-5 pb-5 space-y-3">

          {/* Team summary strip */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label:'Team Size',   value:'12', color:'text-violet-600', bg:'bg-violet-50' },
              { label:'Present',     value:'9',  color:'text-emerald-600',bg:'bg-emerald-50'},
              { label:'On Leave',    value:'2',  color:'text-amber-600',  bg:'bg-amber-50'  },
              { label:'Pending Approvals', value:'5', color:'text-red-500', bg:'bg-red-50'  },
            ].map(s => (
              <div key={s.label} className={`${s.bg} rounded-lg p-3 text-center`}>
                <p className={`text-2xl font-800 ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-text-muted mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Team today */}
          <div className="bg-white border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users size={15} className="text-text-muted"/>
                <p className="text-sm font-600 text-text-primary">My Team Today</p>
              </div>
              <button className="text-xs font-600 text-primary hover:underline">View All</button>
            </div>
            <div className="space-y-2">
              {teamMembers.map((m, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Avatar name={m.name} size="sm"/>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-600 text-text-primary truncate">{m.name}</p>
                    <p className="text-[10px] text-text-muted">{m.role}</p>
                  </div>
                  <span className={`text-[9px] font-700 px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS[m.status].cls}`}>
                    {STATUS[m.status].label}
                  </span>
                  <span className="text-[10px] text-text-muted w-14 text-right flex-shrink-0">{m.hours}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <PendingApprovals />
            <QuickActions />
          </div>

          <AttendanceSummary />
          <LeaveSummary />

        </div>
      </div>

      <div className="w-[340px] flex-shrink-0 border-l border-border bg-white overflow-hidden flex flex-col">
        <CompanyFeed />
      </div>
    </div>
  )
}