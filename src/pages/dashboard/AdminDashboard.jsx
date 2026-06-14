import { useState } from 'react'
import { Bell, Shield } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

import KPIWidgets         from '@/components/dashboard/KPIWidgets'
import NotificationsPanel from '@/components/dashboard/NotificationsPanel'
import QuickActions       from '@/components/dashboard/QuickActions'
import PendingApprovals   from '@/components/dashboard/PendingApprovals'
import AttendanceSummary  from '@/components/dashboard/AttendanceSummary'
import LeaveSummary       from '@/components/dashboard/LeaveSummary'
import RecruitmentSummary from '@/components/dashboard/RecruitmentSummary'
import PayrollInsights    from '@/components/dashboard/PayrollInsights'
import OrgAnnouncements   from '@/components/dashboard/OrgAnnouncements'
import CompanyFeed        from '@/components/dashboard/CompanyFeed'

const systemHealth = [
  { label:'Active Users',    value:'231',   color:'text-emerald-600' },
  { label:'Pending Actions', value:'47',    color:'text-amber-600'   },
  { label:'System Uptime',   value:'99.9%', color:'text-blue-600'    },
  { label:'Data Backups',    value:'OK',    color:'text-emerald-600' },
]

export default function AdminDashboard() {
  const { user } = useAuth()
  const [showNotif, setShowNotif] = useState(false)

  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-y-auto">

        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <div>
            <h2 className="font-700 text-text-primary">Admin Dashboard</h2>
            <p className="text-xs text-text-muted">Welcome back, {user?.name?.split(' ')[0]} 👋</p>
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

          {/* KPIs */}
          <KPIWidgets />

          {/* System health strip */}
          <div className="grid grid-cols-4 gap-3">
            {systemHealth.map(s => (
              <div key={s.label} className="bg-white border border-border rounded-lg p-3 flex items-center gap-2">
                <Shield size={14} className="text-slate-400 flex-shrink-0"/>
                <div>
                  <p className={`text-base font-800 leading-none ${s.color}`}>{s.value}</p>
                  <p className="text-[10px] text-text-muted mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <PendingApprovals />
            <QuickActions />
          </div>

          <AttendanceSummary />

          <div className="grid grid-cols-2 gap-3">
            <LeaveSummary />
            <RecruitmentSummary />
          </div>

          <PayrollInsights />

          <div>
            <p className="text-sm font-700 text-text-primary mb-2">Post an Announcement</p>
            <OrgAnnouncements />
          </div>

        </div>
      </div>

      <div className="w-[340px] flex-shrink-0 border-l border-border bg-white overflow-hidden flex flex-col">
        <CompanyFeed />
      </div>
    </div>
  )
}