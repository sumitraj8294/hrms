import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import ProtectedRoute from './ProtectedRoute'
import AppLayout   from '@/components/layout/AppLayout'
import AuthLayout  from '@/components/layout/AuthLayout'

import Login          from '@/pages/auth/Login'
import ForgotPassword from '@/pages/auth/ForgotPassword'
import ResetPassword  from '@/pages/auth/ResetPassword'

import HRDashboard        from '@/pages/dashboard/HRDashboard'
import EmployeeDashboard  from '@/pages/dashboard/EmployeeDashboard'
import AdminDashboard     from '@/pages/dashboard/AdminDashboard'
import ManagerDashboard   from '@/pages/dashboard/ManagerDashboard'
import ExecutiveDashboard from '@/pages/dashboard/ExecutiveDashboard'

import EmployeeList       from '@/pages/core-hr/EmployeeList'
import EmployeeProfile    from '@/pages/core-hr/EmployeeProfile'
import AddEmployee        from '@/pages/core-hr/AddEmployee'
import OrgChart           from '@/pages/core-hr/OrgChart'
import DepartmentList     from '@/pages/core-hr/DepartmentList'
import DocumentManagement from '@/pages/core-hr/DocumentManagement'
import HRConfig           from '@/pages/core-hr/HRConfig'

import AttendanceLogs    from '@/pages/attendance/AttendanceLogs'
import Regularization    from '@/pages/attendance/Regularization'
import ShiftRoster       from '@/pages/attendance/ShiftRoster'
import ShiftAssignment   from '@/pages/attendance/ShiftAssignment'
import OvertimeRules     from '@/pages/attendance/OvertimeRules'
import AttendanceReports from '@/pages/attendance/AttendanceReports'
import BiometricDevices  from '@/pages/attendance/BiometricDevices'

// ✅ Leave Module
import LeaveBalance     from '@/pages/leave/LeaveBalance'
import LeaveApplication from '@/pages/leave/LeaveApplication'
import LeaveApproval    from '@/pages/leave/LeaveApproval'
import CompOff          from '@/pages/leave/CompOff'
import HolidayCalendar  from '@/pages/leave/HolidayCalendar'
import LeavePolicies    from '@/pages/leave/LeavePolicies'
import LeaveReports     from '@/pages/leave/LeaveReports'

const Stub = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-64 text-text-muted">
    <p className="text-sm font-600">{title}</p>
    <p className="text-xs mt-1">Coming soon...</p>
  </div>
)

function DashboardRouter() {
  const { user } = useAuth()
  if (user?.role === 'employee')  return <EmployeeDashboard />
  if (user?.role === 'manager')   return <ManagerDashboard />
  if (user?.role === 'executive') return <ExecutiveDashboard />
  if (user?.role === 'admin' || user?.role === 'super_admin') return <AdminDashboard />
  return <HRDashboard />
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login"           element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password"  element={<ResetPassword />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardRouter />} />

          <Route path="/core-hr"             element={<EmployeeList />} />
          <Route path="/core-hr/directory"   element={<EmployeeList />} />
          <Route path="/core-hr/add"         element={<AddEmployee />} />
          <Route path="/core-hr/:id"         element={<EmployeeProfile />} />
          <Route path="/core-hr/org"         element={<OrgChart />} />
          <Route path="/core-hr/departments" element={<DepartmentList />} />
          <Route path="/core-hr/documents"   element={<DocumentManagement />} />
          <Route path="/core-hr/config"      element={<HRConfig />} />

          <Route path="/attendance"                  element={<AttendanceLogs />} />
          <Route path="/attendance/regularize"       element={<Regularization />} />
          <Route path="/attendance/roster"           element={<ShiftRoster />} />
          <Route path="/attendance/shift-assignment" element={<ShiftAssignment />} />
          <Route path="/attendance/overtime"         element={<OvertimeRules />} />
          <Route path="/attendance/reports"          element={<AttendanceReports />} />
          <Route path="/attendance/devices"          element={<BiometricDevices />} />

          {/* ✅ Leave */}
          <Route path="/leave"           element={<LeaveBalance />} />
          <Route path="/leave/apply"     element={<LeaveApplication />} />
          <Route path="/leave/approvals" element={<LeaveApproval />} />
          <Route path="/leave/comp-off"  element={<CompOff />} />
          <Route path="/leave/holidays"  element={<HolidayCalendar />} />
          <Route path="/leave/policies"  element={<LeavePolicies />} />
          <Route path="/leave/reports"   element={<LeaveReports />} />

          <Route path="/payroll"            element={<Stub title="Payroll Run" />} />
          <Route path="/payroll/structure"  element={<Stub title="Salary Structure" />} />
          <Route path="/payroll/payslip"    element={<Stub title="Payslips" />} />
          <Route path="/recruitment"            element={<Stub title="Job Openings" />} />
          <Route path="/recruitment/candidates" element={<Stub title="Candidates" />} />
          <Route path="/recruitment/interviews" element={<Stub title="Interviews" />} />
          <Route path="/recruitment/offers"     element={<Stub title="Offer Management" />} />
          <Route path="/onboarding"         element={<Stub title="Pre-Onboarding" />} />
          <Route path="/onboarding/joining" element={<Stub title="Joining Checklist" />} />
          <Route path="/onboarding/exit"    element={<Stub title="Exit Management" />} />
          <Route path="/performance"           element={<Stub title="Goals and OKRs" />} />
          <Route path="/performance/appraisal" element={<Stub title="Appraisals" />} />
          <Route path="/performance/feedback"  element={<Stub title="Feedback" />} />
          <Route path="/lms"             element={<Stub title="All Courses" />} />
          <Route path="/lms/my-learning" element={<Stub title="My Learning" />} />
          <Route path="/lms/:id"         element={<Stub title="Course Detail" />} />
          <Route path="/expense"           element={<Stub title="Expense Claims" />} />
          <Route path="/expense/approvals" element={<Stub title="Expense Approvals" />} />
          <Route path="/projects"            element={<Stub title="Projects" />} />
          <Route path="/projects/timesheets" element={<Stub title="Timesheets" />} />
          <Route path="/rooms"              element={<Stub title="Room Booking" />} />
          <Route path="/rooms/availability" element={<Stub title="Room Availability" />} />
          <Route path="/engagement"         element={<Stub title="Social Feed" />} />
          <Route path="/engagement/rewards" element={<Stub title="Rewards" />} />
          <Route path="/engagement/surveys" element={<Stub title="Surveys" />} />
          <Route path="/helpdesk"     element={<Stub title="My Tickets" />} />
          <Route path="/helpdesk/new" element={<Stub title="Raise Ticket" />} />
          <Route path="/helpdesk/kb"  element={<Stub title="Knowledge Base" />} />
          <Route path="/reports"        element={<Stub title="Analytics" />} />
          <Route path="/reports/custom" element={<Stub title="Custom Reports" />} />
          <Route path="/admin"              element={<Stub title="User Management" />} />
          <Route path="/admin/roles"        element={<Stub title="Roles and Permissions" />} />
          <Route path="/admin/settings"     element={<Stub title="System Settings" />} />
          <Route path="/admin/audit"        element={<Stub title="Audit Logs" />} />
          <Route path="/admin/integrations" element={<Stub title="Integrations" />} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}