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

// Quick-access card data
const absent = ['Alice','Manjuna','Kedhar','Divya','Rahul']
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
        </div>

        <div className="px-5 pb-5 space-y-3">

          {/* KPI Widgets — 6 cards */}
          <KPIWidgets />

          {/* Quick card 2-col grid */}
          <div className="grid grid-cols-2 gap-3">

            {/* Open Actions */}
            <div className="bg-white border border-border rounded-lg p-4">
              <p className="text-sm font-600 text-text-primary mb-2">Open Actions</p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-4xl font-800 text-text-primary leading-none mb-2">123</p>
                  <p className="text-xs text-text-secondary">Tasks waiting — Leaves, attendance, Reviews</p>
                </div>
                <button className="btn-primary text-xs px-3 py-1.5 whitespace-nowrap">Take Action</button>
              </div>
            </div>

            {/* Attendance quick */}
            <div className="bg-white border border-border rounded-lg p-4">
              <p className="text-sm font-600 text-text-primary mb-2">Attendance</p>
              <div className="flex gap-5 mb-3">
                <div><p className="text-2xl font-800 text-primary">6.8</p><p className="text-[10px] text-text-muted uppercase tracking-wide">Avg Hrs/Day</p></div>
                <div><p className="text-2xl font-800 text-primary">60%</p><p className="text-[10px] text-text-muted uppercase tracking-wide">On Time</p></div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div><p className="text-xs font-600">09:01 AM</p><p className="text-[10px] text-text-muted">Today</p></div>
                <button className="text-xs font-600 text-primary hover:underline">Clock In</button>
              </div>
            </div>

            {/* Not in office */}
            <div className="bg-white border border-border rounded-lg p-4">
              <p className="text-sm font-600 text-text-primary mb-2">Not in Office Today</p>
              <div className="flex gap-1.5 mb-1">
                {absent.slice(0,4).map((u,i) => <Avatar key={i} name={u} size="sm"/>)}
                <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[9px] font-700 text-text-muted">+{absent.length - 4}</div>
              </div>
              <div className="flex gap-2 mb-2">
                {absent.slice(0,4).map((u,i) => <p key={i} className="text-[9px] text-text-muted w-7 text-center truncate">{u}</p>)}
              </div>
              <p className="text-xs text-text-secondary">2 employees in HR are out today</p>
            </div>

            {/* Leave Balances */}
            <div className="bg-white border border-border rounded-lg p-4">
              <p className="text-sm font-600 text-text-primary mb-2">Leave Balances</p>
              <div className="flex gap-6 mb-3">
                <div><p className="text-2xl font-800 text-primary">6.8</p><p className="text-[10px] text-text-muted uppercase">Casual</p></div>
                <div><p className="text-2xl font-800 text-primary">6.8</p><p className="text-[10px] text-text-muted uppercase">Sick</p></div>
              </div>
              <div className="pt-2 border-t border-border text-right">
                <button className="text-xs font-600 text-primary hover:underline">Apply Leave</button>
              </div>
            </div>

            {/* Project Time */}
            <div className="bg-white border border-border rounded-lg p-4">
              <p className="text-sm font-600 text-text-primary mb-1">Project Time</p>
              <p className="text-[10px] text-text-muted uppercase tracking-wide mb-1">Time Worked</p>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-800 text-text-primary">08<span className="text-lg font-600">h </span>30<span className="text-lg font-600">m</span></p>
                <button className="text-xs border border-primary text-primary px-3 py-1 rounded-md hover:bg-primary/5 font-600">Update</button>
              </div>
              <p className="text-xs text-text-secondary mt-1.5">Disney Pictures <span className="text-primary font-600 cursor-pointer">+ 2 projects</span></p>
            </div>

            {/* Salary Update */}
            <div className="bg-white border border-border rounded-lg p-4">
              <p className="text-sm font-600 text-text-primary mb-2">Salary Update</p>
              <div className="flex gap-5 mb-3">
                <div><p className="text-[10px] text-text-muted uppercase mb-0.5">Working Days</p><p className="text-xl font-700">30 Days</p></div>
                <div><p className="text-[10px] text-text-muted uppercase mb-0.5">Status</p><p className="text-xl font-700 text-emerald-500">Disbursed</p></div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <p className="text-xs text-text-secondary">May 2024</p>
                <button className="text-xs font-600 text-primary hover:underline">View Payslip</button>
              </div>
            </div>

            {/* My Appraisal */}
            <div className="bg-white border border-border rounded-lg p-4">
              <p className="text-sm font-600 text-text-primary mb-3">My Appraisal</p>
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

            {/* My Goals */}
            <div className="bg-white border border-border rounded-lg p-4">
              <p className="text-sm font-600 text-text-primary mb-2">My Goals</p>
              <div className="flex gap-6 mb-3">
                <div><p className="text-3xl font-800">6</p><p className="text-[10px] text-text-muted uppercase mt-1">Goals</p></div>
                <div><p className="text-3xl font-800 text-primary">60%</p><p className="text-[10px] text-text-muted uppercase mt-1">On Target</p></div>
              </div>
              <div className="pt-2 border-t border-border text-right">
                <button className="text-xs font-600 text-primary hover:underline">View Goals</button>
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