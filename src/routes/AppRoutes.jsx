import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import AppLayout from '@/components/layout/AppLayout'
import AuthLayout from '@/components/layout/AuthLayout'

import Login          from '@/pages/auth/Login'
import ForgotPassword from '@/pages/auth/ForgotPassword'
import ResetPassword  from '@/pages/auth/ResetPassword'

import HRDashboard        from '@/pages/dashboard/HRDashboard'
import EmployeeDashboard  from '@/pages/dashboard/EmployeeDashboard'
import AdminDashboard     from '@/pages/dashboard/AdminDashboard'
import ManagerDashboard   from '@/pages/dashboard/ManagerDashboard'
import ExecutiveDashboard from '@/pages/dashboard/ExecutiveDashboard'

import EmployeeList   from '@/pages/core-hr/EmployeeList'
import EmployeeProfile from '@/pages/core-hr/EmployeeProfile'
import AddEmployee    from '@/pages/core-hr/AddEmployee'
import OrgChart       from '@/pages/core-hr/OrgChart'
import DepartmentList      from '@/pages/core-hr/DepartmentList'
import DocumentManagement  from '@/pages/core-hr/DocumentManagement'
import HRConfig            from '@/pages/core-hr/HRConfig'

import AttendanceLogs  from '@/pages/attendance/AttendanceLogs'
import ShiftRoster     from '@/pages/attendance/ShiftRoster'
import Regularization  from '@/pages/attendance/Regularization'

import LeaveApplication from '@/pages/leave/LeaveApplication'
import LeaveApproval    from '@/pages/leave/LeaveApproval'
import LeaveBalance     from '@/pages/leave/LeaveBalance'
import HolidayCalendar  from '@/pages/leave/HolidayCalendar'

import SalaryStructure from '@/pages/payroll/SalaryStructure'
import PayrollRun      from '@/pages/payroll/PayrollRun'
import Payslip         from '@/pages/payroll/Payslip'

import JobOpenings         from '@/pages/recruitment/JobOpenings'
import CandidateList       from '@/pages/recruitment/CandidateList'
import InterviewSchedule   from '@/pages/recruitment/InterviewSchedule'
import OfferManagement     from '@/pages/recruitment/OfferManagement'

import GoalManagement  from '@/pages/performance/GoalManagement'
import AppraisalCycle  from '@/pages/performance/AppraisalCycle'
import FeedbackModule  from '@/pages/performance/FeedbackModule'

import CourseList   from '@/pages/lms/CourseList'
import CourseDetail from '@/pages/lms/CourseDetail'
import MyLearning   from '@/pages/lms/MyLearning'

import ExpenseClaims  from '@/pages/expense/ExpenseClaims'
import ExpenseApproval from '@/pages/expense/ExpenseApproval'

import ProjectList from '@/pages/projects/ProjectList'
import Timesheets  from '@/pages/projects/Timesheets'

import RoomBooking     from '@/pages/rooms/RoomBooking'
import RoomAvailability from '@/pages/rooms/RoomAvailability'

import SocialFeed from '@/pages/engagement/SocialFeed'
import Rewards    from '@/pages/engagement/Rewards'
import Surveys    from '@/pages/engagement/Surveys'

import TicketList     from '@/pages/helpdesk/TicketList'
import CreateTicket   from '@/pages/helpdesk/CreateTicket'
import KnowledgeBase  from '@/pages/helpdesk/KnowledgeBase'

import AnalyticsDashboard from '@/pages/reports/AnalyticsDashboard'
import CustomReports      from '@/pages/reports/CustomReports'

import UserManagement  from '@/pages/admin/UserManagement'
import RolePermissions from '@/pages/admin/RolePermissions'
import SystemSettings  from '@/pages/admin/SystemSettings'
import AuditLogs       from '@/pages/admin/AuditLogs'
import Integrations    from '@/pages/admin/Integrations'

import { useAuth } from '@/context/AuthContext'

function DashboardRouter() {
  const { user } = useAuth()
  if (user?.role === 'employee')                        return <EmployeeDashboard />
  if (user?.role === 'admin' || user?.role === 'super_admin') return <AdminDashboard />
  if (user?.role === 'manager')                         return <ManagerDashboard />
  if (user?.role === 'executive')                       return <ExecutiveDashboard />
  return <HRDashboard />
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth */}
      <Route element={<AuthLayout />}>
        <Route path="/login"          element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password"  element={<ResetPassword />} />
      </Route>

      {/* Protected App */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard"              element={<DashboardRouter />} />
          <Route path="/core-hr"                element={<EmployeeList />} />
          <Route path="/core-hr/add"            element={<AddEmployee />} />
          <Route path="/core-hr/:id"            element={<EmployeeProfile />} />
          <Route path="/core-hr/org"            element={<OrgChart />} />
          <Route path="/core-hr/departments"    element={<DepartmentList />} />
          <Route path="/core-hr/documents"      element={<DocumentManagement />} />
          <Route path="/core-hr/config"         element={<HRConfig />} />
          <Route path="/attendance"             element={<AttendanceLogs />} />
          <Route path="/attendance/roster"      element={<ShiftRoster />} />
          <Route path="/attendance/regularize"  element={<Regularization />} />
          <Route path="/leave"                  element={<LeaveBalance />} />
          <Route path="/leave/apply"            element={<LeaveApplication />} />
          <Route path="/leave/approvals"        element={<LeaveApproval />} />
          <Route path="/leave/holidays"         element={<HolidayCalendar />} />
          <Route path="/payroll"                element={<PayrollRun />} />
          <Route path="/payroll/structure"      element={<SalaryStructure />} />
          <Route path="/payroll/payslip"        element={<Payslip />} />
          <Route path="/recruitment"            element={<JobOpenings />} />
          <Route path="/recruitment/candidates" element={<CandidateList />} />
          <Route path="/recruitment/interviews" element={<InterviewSchedule />} />
          <Route path="/recruitment/offers"     element={<OfferManagement />} />
          <Route path="/performance"            element={<GoalManagement />} />
          <Route path="/performance/appraisal"  element={<AppraisalCycle />} />
          <Route path="/performance/feedback"   element={<FeedbackModule />} />
          <Route path="/lms"                    element={<CourseList />} />
          <Route path="/lms/:id"                element={<CourseDetail />} />
          <Route path="/lms/my-learning"        element={<MyLearning />} />
          <Route path="/expense"                element={<ExpenseClaims />} />
          <Route path="/expense/approvals"      element={<ExpenseApproval />} />
          <Route path="/projects"               element={<ProjectList />} />
          <Route path="/projects/timesheets"    element={<Timesheets />} />
          <Route path="/rooms"                  element={<RoomBooking />} />
          <Route path="/rooms/availability"     element={<RoomAvailability />} />
          <Route path="/engagement"             element={<SocialFeed />} />
          <Route path="/engagement/rewards"     element={<Rewards />} />
          <Route path="/engagement/surveys"     element={<Surveys />} />
          <Route path="/helpdesk"               element={<TicketList />} />
          <Route path="/helpdesk/new"           element={<CreateTicket />} />
          <Route path="/helpdesk/kb"            element={<KnowledgeBase />} />
          <Route path="/reports"                element={<AnalyticsDashboard />} />
          <Route path="/reports/custom"         element={<CustomReports />} />
          <Route path="/admin"                  element={<UserManagement />} />
          <Route path="/admin/roles"            element={<RolePermissions />} />
          <Route path="/admin/settings"         element={<SystemSettings />} />
          <Route path="/admin/audit"            element={<AuditLogs />} />
          <Route path="/admin/integrations"     element={<Integrations />} />
          <Route path="*"                       element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}