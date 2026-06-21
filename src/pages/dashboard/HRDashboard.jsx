import { useState, useRef } from 'react'
import { Bell, Settings, Clock, UserX, FolderClock, Star, Target, Plane, ChevronDown } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import { useAuth } from '@/context/AuthContext'

// Dashboard components
import KPIWidgets         from '@/components/dashboard/KPIWidgets'
import NotificationsPanel from '@/components/dashboard/NotificationsPanel'
import QuickActions       from '@/components/dashboard/QuickActions'
import OrgAnnouncements   from '@/components/dashboard/OrgAnnouncements'
import PendingApprovals   from '@/components/dashboard/PendingApprovals'
import AttendanceSummary  from '@/components/dashboard/AttendanceSummary'
import LeaveSummary       from '@/components/dashboard/LeaveSummary'
import RecruitmentSummary from '@/components/dashboard/RecruitmentSummary'
import PayrollInsights    from '@/components/dashboard/PayrollInsights'
import CompanyFeed        from '@/components/dashboard/CompanyFeed'

// Illustration images
import openActionsImg   from '@/assets/dashboard/opentasks.png'
import attendanceImg    from '@/assets/dashboard/present.png'
import notInOfficeImg   from '@/assets/dashboard/absent.png'
import leaveBalancesImg from '@/assets/dashboard/outofoffice.png'
import projectTimeImg   from '@/assets/dashboard/project.png'
import salaryUpdateImg  from '@/assets/dashboard/salary.png'
import appraisalImg     from '@/assets/dashboard/appraisal.png'
import goalsImg         from '@/assets/dashboard/goals.png'

// Quick-access card data
const absent = [
  { name: 'Alice',   img: 'https://i.pravatar.cc/150?img=5'  },
  { name: 'Manjuna', img: 'https://i.pravatar.cc/150?img=12' },
  { name: 'Kedhar',  img: 'https://i.pravatar.cc/150?img=33' },
  { name: 'Divya',   img: 'https://i.pravatar.cc/150?img=47' },
  { name: 'Rahul',   img: 'https://i.pravatar.cc/150?img=14' },
]
const appraisalData = [
  {label:'Self',    value:4.5, color:'bg-emerald-400'},
  {label:'Manager', value:4.2, color:'bg-violet-400'},
  {label:'Peers',   value:4.4, color:'bg-blue-400'},
]

export default function HRDashboard() {
  const { user } = useAuth()
  const [showNotif, setShowNotif] = useState(false)
  const [feedPosts, setFeedPosts] = useState([])   // posts from OrgAnnouncements flow into feed
  const notifRef = useRef()

  return (
    <div className="flex h-full relative">

      {/* ── LEFT SCROLLABLE COLUMN ── */}
      <div className="flex-1 overflow-y-auto">

        {/* Top bar inside content */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <div>
            <h2 className="font-700 text-text-primary">Quick Access</h2>
            <p className="text-xs text-text-muted mt-0.5">Good morning, {user?.name?.split(' ')[0]} 👋</p>
          </div>

          

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {/* Notification bell */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setShowNotif(v => !v)}
                  className="relative w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center text-text-secondary hover:text-primary transition-colors"
                >
                  <Bell size={15}/>
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full"/>
                </button>
                
                {showNotif && (
                  <div className="absolute right-0 top-10 z-50">
                    <NotificationsPanel onClose={() => setShowNotif(false)}/>
                  </div>
                )}
              </div>
              <Settings size={14} className="text-text-muted cursor-pointer hover:text-primary transition-colors"/>
            </div>

            {/* Welcome illustration — extreme right */}
            
          </div>
        </div>

        <div className="px-5 pb-5 space-y-3">

          {/* KPI Widgets — 6 cards */}
          <KPIWidgets />

          {/* Quick card 2-col grid */}
          <div className="grid grid-cols-2 gap-4">

            {/* Open Actions */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-white border border-blue-100/70 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
              <img src={openActionsImg} alt="" className="absolute -right-4 -top-4 w-28 h-28 object-contain opacity-15 pointer-events-none select-none" />

              <div className="relative z-10">
                <p className="text-base font-bold text-slate-800 mb-3">
                  Open Actions
                </p>

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-5xl font-extrabold text-[#1f2b44] leading-none mb-2">
                      123
                    </p>
                    <p className="text-xs text-slate-500">
                      Tasks waiting — Leaves, Attendance, Reviews
                    </p>
                  </div>

                  <button className="bg-[#1f2b44] hover:bg-[#162033] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">
                    Take Action
                  </button>
                </div>
              </div>
            </div>

            {/* Attendance */}
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-white border border-emerald-100/70 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
              <img src={attendanceImg} alt="" className="absolute -right-4 -top-4 w-28 h-28 object-contain opacity-15 pointer-events-none select-none" />

              <div className="relative z-10">
                <p className="text-base font-bold text-slate-800 mb-3">
                  Attendance
                </p>

                <div className="flex gap-6 mb-4">
                  <div>
                    <p className="text-3xl font-extrabold text-[#1f2b44]">
                      6.8
                    </p>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">
                      Avg Hrs/Day
                    </p>
                  </div>

                  <div>
                    <p className="text-3xl font-extrabold text-[#1f2b44]">
                      60%
                    </p>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">
                      On Time
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      09:01 AM
                    </p>
                    <p className="text-xs text-slate-500">
                      Today
                    </p>
                  </div>

                  <button className="text-xs font-bold text-[#1f2b44] hover:underline">
                    Clock In
                  </button>
                </div>
              </div>
            </div>

            {/* Not In Office */}
<div className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-white border border-amber-100/70 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
  <img src={notInOfficeImg} alt="" className="absolute -right-4 -top-4 w-28 h-28 object-contain opacity-15 pointer-events-none select-none" />

  <div className="relative z-10">
    <p className="text-base font-bold text-slate-800 mb-3">
      Not in Office Today
    </p>

    <div className="flex gap-1.5 mb-2">
      {absent.slice(0, 4).map((u, i) => (
        <img
          key={i}
          src={u.img}
          alt={u.name}
          className="w-7 h-7 rounded-full object-cover border-2 border-white shadow-sm"
        />
      ))}

      <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-600">
        +{absent.length - 4}
      </div>
    </div>

    <div className="flex gap-2 mb-3">
      {absent.slice(0, 4).map((u, i) => (
        <p
          key={i}
          className="text-[10px] text-slate-500 w-7 text-center truncate"
        >
          {u.name}
        </p>
      ))}
    </div>

    <p className="text-xs text-slate-500">
      2 employees in HR are out today
    </p>
  </div>
</div>

            {/* Leave Balances */}
            <div className="relative overflow-hidden bg-gradient-to-br from-violet-50 to-white border border-violet-100/70 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
              <img src={leaveBalancesImg} alt="" className="absolute -right-4 -top-4 w-28 h-28 object-contain opacity-15 pointer-events-none select-none" />

              <div className="relative z-10">
                <p className="text-base font-bold text-slate-800 mb-3">
                  Leave Balances
                </p>

                <div className="flex gap-8 mb-4">
                  <div>
                    <p className="text-3xl font-extrabold text-[#1f2b44]">
                      6.8
                    </p>
                    <p className="text-xs text-slate-500 uppercase">
                      Casual
                    </p>
                  </div>

                  <div>
                    <p className="text-3xl font-extrabold text-[#1f2b44]">
                      6.8
                    </p>
                    <p className="text-xs text-slate-500 uppercase">
                      Sick
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 text-right">
                  <button className="text-xs font-bold text-[#1f2b44] hover:underline">
                    Apply Leave
                  </button>
                </div>
              </div>
            </div>

            {/* Project Time */}
            <div className="relative overflow-hidden bg-gradient-to-br from-pink-50 to-white border border-pink-100/70 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
              <img src={projectTimeImg} alt="" className="absolute -right-4 -top-4 w-28 h-28 object-contain opacity-15 pointer-events-none select-none" />

              <div className="relative z-10">
                <p className="text-base font-bold text-slate-800 mb-2">
                  Project Time
                </p>

                <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">
                  Time Worked
                </p>

                <div className="flex items-end justify-between">
                  <p className="text-4xl font-extrabold text-[#1f2b44]">
                    08<span className="text-xl font-semibold">h </span>
                    30<span className="text-xl font-semibold">m</span>
                  </p>

                  <button className="border border-[#1f2b44] text-[#1f2b44] px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-50">
                    Update
                  </button>
                </div>

                <p className="text-xs text-slate-500 mt-2">
                  Disney Pictures{' '}
                  <span className="text-[#1f2b44] font-bold cursor-pointer">
                    + 2 projects
                  </span>
                </p>
              </div>
            </div>

            {/* Salary Update */}
            <div className="relative overflow-hidden bg-gradient-to-br from-cyan-50 to-white border border-cyan-100/70 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
              <img src={salaryUpdateImg} alt="" className="absolute -right-4 -top-4 w-28 h-28 object-contain opacity-15 pointer-events-none select-none" />

              <div className="relative z-10">
                <p className="text-base font-bold text-slate-800 mb-3">
                  Salary Update
                </p>

                <div className="flex gap-6 mb-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase mb-1">
                      Working Days
                    </p>

                    <p className="text-xl font-bold text-slate-800">
                      30 Days
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 uppercase mb-1">
                      Status
                    </p>

                    <p className="text-xl font-bold text-emerald-600">
                      Disbursed
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                  <p className="text-xs text-slate-500">
                    May 2024
                  </p>

                  <button className="text-xs font-bold text-[#1f2b44] hover:underline">
                    View Payslip
                  </button>
                </div>
              </div>
            </div>

            {/* My Appraisal */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 to-white border border-indigo-100/70 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
              <img src={appraisalImg} alt="" className="absolute -right-4 -top-4 w-28 h-28 object-contain opacity-15 pointer-events-none select-none" />

              <div className="relative z-10">
                <p className="text-base font-bold text-slate-800 mb-4">
                  My Appraisal
                </p>

                <div className="space-y-3">
                  {appraisalData.map((a) => (
                    <div key={a.label} className="flex items-center gap-2">
                      <span className="text-xs text-slate-600 w-14 font-semibold">
                        {a.label}
                      </span>

                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${a.color} rounded-full`}
                          style={{ width: `${(a.value / 5) * 100}%` }}
                        />
                      </div>

                      <span className="text-xs font-bold text-[#1f2b44] w-6">
                        {a.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* My Goals */}
            <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-white border border-orange-100/70 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
              <img src={goalsImg} alt="" className="absolute -right-4 -top-4 w-28 h-28 object-contain opacity-15 pointer-events-none select-none" />

              <div className="relative z-10">
                <p className="text-base font-bold text-slate-800 mb-3">
                  My Goals
                </p>

                <div className="flex gap-8 mb-4">
                  <div>
                    <p className="text-4xl font-extrabold text-[#1f2b44]">
                      6
                    </p>
                    <p className="text-xs text-slate-500 uppercase mt-1">
                      Goals
                    </p>
                  </div>

                  <div>
                    <p className="text-4xl font-extrabold text-[#1f2b44]">
                      60%
                    </p>
                    <p className="text-xs text-slate-500 uppercase mt-1">
                      On Target
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 text-right">
                  <button className="text-xs font-bold text-[#1f2b44] hover:underline">
                    View Goals
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Actions */}
          <QuickActions />

          {/* Pending Approvals */}
          <PendingApprovals />

          {/* Attendance Summary */}
          <AttendanceSummary />

          <div className="grid grid-cols-2 gap-3">
            {/* Leave Summary */}
            <LeaveSummary />
            {/* Recruitment Summary */}
            <RecruitmentSummary />
          </div>

          {/* Payroll Insights */}
          <PayrollInsights />

          {/* Org Announcements Post Composer */}
          <div>
            <p className="text-sm font-700 text-text-primary mb-2">Post an Update</p>
            <OrgAnnouncements />
          </div>

          {/* Next Holiday */}
          <div className="bg-white border border-border rounded-lg p-4 flex items-center gap-6">
            <div>
              <p className="text-sm font-600 text-text-primary mb-1">Next Holiday</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-800">28</span>
                <div><p className="text-xs font-600 text-text-secondary">MAY</p><p className="text-xs text-text-muted">2024</p></div>
              </div>
            </div>
            <div className="text-3xl">✈️</div>
            <div>
              <p className="text-sm font-700">Company Offsite - Manali</p>
              <p className="text-xs text-text-secondary mt-0.5">Enjoy a refreshing break with your team and create memories together!</p>
            </div>
          </div>

        </div>
      </div>

      {/* ── RIGHT FEED COLUMN ── */}
      <div className="w-[340px] flex-shrink-0 border-l border-border bg-white overflow-hidden flex flex-col">
        <CompanyFeed extraPosts={feedPosts}/>
      </div>

    </div>
  )
}