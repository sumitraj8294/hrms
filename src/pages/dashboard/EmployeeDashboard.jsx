import { useState, useRef } from 'react'
import { Bell } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

import KPIWidgets         from '@/components/dashboard/KPIWidgets'
import NotificationsPanel from '@/components/dashboard/NotificationsPanel'
import QuickActions       from '@/components/dashboard/QuickActions'
import AttendanceSummary  from '@/components/dashboard/AttendanceSummary'
import LeaveSummary       from '@/components/dashboard/LeaveSummary'
import PayrollInsights    from '@/components/dashboard/PayrollInsights'
import CompanyFeed        from '@/components/dashboard/CompanyFeed'
import Avatar             from '@/components/ui/Avatar'

const appraisalData = [
  {label:'Self',    value:4.6, color:'bg-emerald-400'},
  {label:'Manager', value:4.3, color:'bg-violet-400'},
  {label:'Peers',   value:4.4, color:'bg-blue-400'},
]

export default function EmployeeDashboard() {
  const { user } = useAuth()
  const [showNotif, setShowNotif] = useState(false)

  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-y-auto">

        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <div>
            <h2 className="font-700 text-text-primary">Quick Access</h2>
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
          {/* Employee KPIs — filtered */}
          <div className="grid grid-cols-3 gap-3">
            {[
              {label:'Leave Balance',  value:'12 days', sub:'Casual + Sick',    bg:'bg-emerald-50', tc:'text-emerald-600'},
              {label:'May Salary',     value:'₹68,000', sub:'Disbursed Jun 1',  bg:'bg-violet-50',  tc:'text-violet-600'},
              {label:'Active Goals',   value:'5 / 7',   sub:'71% on target',    bg:'bg-blue-50',    tc:'text-blue-600'  },
            ].map(k => (
              <div key={k.label} className={`${k.bg} rounded-lg p-3`}>
                <p className={`text-xl font-800 ${k.tc}`}>{k.value}</p>
                <p className="text-xs font-600 text-text-primary mt-0.5">{k.label}</p>
                <p className="text-[10px] text-text-muted">{k.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Attendance */}
            <div className="bg-white border border-border rounded-lg p-4">
              <p className="text-sm font-600 text-text-primary mb-2">Attendance</p>
              <div className="flex gap-5 mb-3">
                <div><p className="text-2xl font-800 text-primary">6.8</p><p className="text-[10px] text-text-muted uppercase">Avg Hrs/Day</p></div>
                <div><p className="text-2xl font-800 text-primary">62%</p><p className="text-[10px] text-text-muted uppercase">On Time</p></div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div><p className="text-xs font-600">09:10 AM</p><p className="text-[10px] text-text-muted">Today</p></div>
                <button className="text-xs font-600 text-primary hover:underline">Clock In</button>
              </div>
            </div>

            {/* Leave */}
            <div className="bg-white border border-border rounded-lg p-4">
              <p className="text-sm font-600 text-text-primary mb-2">Leave Balance</p>
              <div className="flex gap-5 mb-3">
                <div><p className="text-2xl font-800 text-primary">7.0</p><p className="text-[10px] text-text-muted uppercase">Casual</p></div>
                <div><p className="text-2xl font-800 text-primary">5.0</p><p className="text-[10px] text-text-muted uppercase">Sick</p></div>
              </div>
              <div className="pt-2 border-t border-border text-right">
                <button className="text-xs font-600 text-primary hover:underline">Apply Leave</button>
              </div>
            </div>

            {/* Logged Hours */}
            <div className="bg-white border border-border rounded-lg p-4">
              <p className="text-sm font-600 text-text-primary mb-1">Logged Hours</p>
              <p className="text-[10px] text-text-muted uppercase mb-1">This Week</p>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-800">09<span className="text-lg font-600">h </span>35<span className="text-lg font-600">m</span></p>
                <button className="text-xs border border-amber-400 text-amber-600 px-3 py-1 rounded-md hover:bg-amber-50 font-600">Log Time</button>
              </div>
              <p className="text-xs text-text-secondary mt-1.5">Product Redesign <span className="text-primary font-600">+ 2 projects</span></p>
            </div>

            {/* Payroll */}
            <div className="bg-white border border-border rounded-lg p-4">
              <p className="text-sm font-600 text-text-primary mb-2">Payroll</p>
              <div className="flex gap-4 mb-3">
                <div><p className="text-[10px] text-text-muted uppercase mb-0.5">Working Days</p><p className="text-xl font-700">28 Days</p></div>
                <div><p className="text-[10px] text-text-muted uppercase mb-0.5">Status</p><p className="text-xl font-700 text-emerald-500">Processed</p></div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <p className="text-xs text-text-secondary">May 2024</p>
                <button className="text-xs font-600 text-primary hover:underline">View Payslip</button>
              </div>
            </div>

            {/* Feedback */}
            <div className="bg-white border border-border rounded-lg p-4">
              <p className="text-sm font-600 text-text-primary mb-3">My Feedback</p>
              <div className="space-y-2">
                {appraisalData.map(a => (
                  <div key={a.label} className="flex items-center gap-2">
                    <span className="text-xs text-text-secondary w-14">{a.label}</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${a.color} rounded-full`} style={{width:`${(a.value/5)*100}%`}}/>
                    </div>
                    <span className="text-xs font-600 w-6">{a.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Goals */}
            <div className="bg-white border border-border rounded-lg p-4">
              <p className="text-sm font-600 text-text-primary mb-2">My Goals</p>
              <div className="flex gap-6 mb-3">
                <div><p className="text-3xl font-800">7</p><p className="text-[10px] text-text-muted uppercase mt-1">Goals</p></div>
                <div><p className="text-3xl font-800 text-primary">71%</p><p className="text-[10px] text-text-muted uppercase mt-1">On Target</p></div>
              </div>
              <div className="pt-2 border-t border-border text-right">
                <button className="text-xs font-600 text-primary hover:underline">View Goals</button>
              </div>
            </div>
          </div>

          <QuickActions />
          <AttendanceSummary />
          <LeaveSummary />
          <PayrollInsights />

          {/* Holiday */}
          <div className="bg-white border border-border rounded-lg p-4 flex items-center gap-6">
            <div>
              <p className="text-sm font-600 text-text-primary mb-1">Upcoming Holiday</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-800">28</span>
                <div><p className="text-xs font-600 text-text-secondary">MAY</p><p className="text-xs text-text-muted">2024</p></div>
              </div>
            </div>
            <div className="text-3xl">✈️</div>
            <div>
              <p className="text-sm font-700">Company Offsite - Manali</p>
              <p className="text-xs text-text-secondary mt-0.5">Enjoy a refreshing break with your team!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Feed */}
      <div className="w-[340px] flex-shrink-0 border-l border-border bg-white overflow-hidden flex flex-col">
        <CompanyFeed />
      </div>
    </div>
  )
}