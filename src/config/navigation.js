import { ROLES } from './roles'
export const NAV_ITEMS = [
  { key:'dashboard', label:'Dashboard', icon:'LayoutDashboard', path:'/dashboard', roles:'all' },
  {
    key:'core-hr', label:'Core HR', icon:'Users', path:'/core-hr', roles:[ROLES.SUPER_ADMIN,ROLES.ADMIN,ROLES.HR],
    children:[
      { key:'employee-master',    label:'Employee Directory',    path:'/core-hr' },
      // { key:'employee-directory', label:'Employee Directory', path:'/core-hr/directory' },
      { key:'add-employee',       label:'Add Employee',       path:'/core-hr/add' },
      { key:'org-chart',          label:'Org Chart',          path:'/core-hr/org' },
      { key:'departments',        label:'Departments',        path:'/core-hr/departments' },
      { key:'documents',          label:'Documents',          path:'/core-hr/documents' },
      { key:'hr-config',          label:'HR Configuration',   path:'/core-hr/config' },
    ],
  },
  {
    key:'attendance', label:'Attendance', icon:'Clock', path:'/attendance', roles:'all',
    children:[
      { key:'attendance-logs',    label:'Attendance Logs',    path:'/attendance' },
      { key:'regularization',     label:'Regularization',     path:'/attendance/regularize' },
      { key:'shift-roster',       label:'Shift Roster',       path:'/attendance/roster' },
      { key:'shift-assignment',   label:'Shift Assignment',   path:'/attendance/shift-assignment' },
      { key:'overtime-rules',     label:'Overtime Rules',     path:'/attendance/overtime' },
      { key:'attendance-reports', label:'Attendance Reports', path:'/attendance/reports' },
      { key:'biometric-devices',  label:'Biometric Devices',  path:'/attendance/devices' },
    ],
  },
  {
    key:'leave', label:'Leave', icon:'CalendarOff', path:'/leave', roles:'all',
    children:[
      { key:'leave-balance',   label:'Leave Balance',    path:'/leave' },
      { key:'apply-leave',     label:'Apply Leave',      path:'/leave/apply' },
      { key:'leave-approvals', label:'Approvals',        path:'/leave/approvals' },
      { key:'comp-off',        label:'Comp-Off',         path:'/leave/comp-off' },
      { key:'holidays',        label:'Holiday Calendar', path:'/leave/holidays' },
      { key:'leave-policies',  label:'Leave Policies',   path:'/leave/policies' },
      { key:'leave-reports',   label:'Leave Reports',    path:'/leave/reports' },
    ],
  },
  {
    key:'payroll', label:'Payroll', icon:'DollarSign', path:'/payroll', roles:[ROLES.SUPER_ADMIN,ROLES.ADMIN,ROLES.HR],
    children:[
      { key:'payroll-run',      label:'Payroll Run',      path:'/payroll' },
      { key:'salary-structure', label:'Salary Structure', path:'/payroll/structure' },
      { key:'payslip',          label:'Payslips',         path:'/payroll/payslip' },
    ],
  },
  {
    key:'recruitment', label:'Recruitment', icon:'UserSearch', path:'/recruitment', roles:[ROLES.SUPER_ADMIN,ROLES.ADMIN,ROLES.HR],
    children:[
      { key:'job-openings', label:'Job Openings',     path:'/recruitment' },
      { key:'candidates',   label:'Candidates',       path:'/recruitment/candidates' },
      { key:'interviews',   label:'Interviews',       path:'/recruitment/interviews' },
      { key:'offers',       label:'Offer Management', path:'/recruitment/offers' },
    ],
  },
  {
    key:'onboarding', label:'Onboarding', icon:'UserPlus', path:'/onboarding', roles:[ROLES.SUPER_ADMIN,ROLES.ADMIN,ROLES.HR],
    children:[
      { key:'pre-onboarding', label:'Pre-Onboarding',   path:'/onboarding' },
      { key:'joining',        label:'Joining Checklist', path:'/onboarding/joining' },
      { key:'exit',           label:'Exit Management',   path:'/onboarding/exit' },
    ],
  },
  {
    key:'performance', label:'Performance', icon:'TrendingUp', path:'/performance', roles:'all',
    children:[
      { key:'goals',     label:'Goals & OKRs', path:'/performance' },
      { key:'appraisal', label:'Appraisals',   path:'/performance/appraisal' },
      { key:'feedback',  label:'Feedback',     path:'/performance/feedback' },
    ],
  },
  {
    key:'lms', label:'Learning', icon:'BookOpen', path:'/lms', roles:'all',
    children:[
      { key:'courses',     label:'All Courses', path:'/lms' },
      { key:'my-learning', label:'My Learning', path:'/lms/my-learning' },
    ],
  },
  {
    key:'expense', label:'Expense', icon:'Receipt', path:'/expense', roles:'all',
    children:[
      { key:'expense-claims',   label:'My Claims',  path:'/expense' },
      { key:'expense-approval', label:'Approvals',  path:'/expense/approvals' },
    ],
  },
  {
    key:'projects', label:'Projects', icon:'FolderKanban', path:'/projects', roles:'all',
    children:[
      { key:'project-list', label:'Projects',   path:'/projects' },
      { key:'timesheets',   label:'Timesheets', path:'/projects/timesheets' },
    ],
  },
  {
    key:'rooms', label:'Rooms', icon:'Building2', path:'/rooms', roles:'all',
    children:[
      { key:'room-booking',      label:'Book a Room',  path:'/rooms' },
      { key:'room-availability', label:'Availability', path:'/rooms/availability' },
    ],
  },
  {
    key:'engagement', label:'Engagement', icon:'Heart', path:'/engagement', roles:'all',
    children:[
      { key:'social-feed', label:'Social Feed', path:'/engagement' },
      { key:'rewards',     label:'Rewards',     path:'/engagement/rewards' },
      { key:'surveys',     label:'Surveys',     path:'/engagement/surveys' },
    ],
  },
  {
    key:'helpdesk', label:'Helpdesk', icon:'Headphones', path:'/helpdesk', roles:'all',
    children:[
      { key:'tickets',        label:'My Tickets',    path:'/helpdesk' },
      { key:'new-ticket',     label:'Raise Ticket',  path:'/helpdesk/new' },
      { key:'knowledge-base', label:'Knowledge Base', path:'/helpdesk/kb' },
    ],
  },
  {
    key:'reports', label:'Reports', icon:'BarChart3', path:'/reports', roles:[ROLES.SUPER_ADMIN,ROLES.ADMIN,ROLES.HR,ROLES.MANAGER],
    children:[
      { key:'analytics',      label:'Analytics',      path:'/reports' },
      { key:'custom-reports', label:'Custom Reports',  path:'/reports/custom' },
    ],
  },
  {
    key:'admin', label:'Admin', icon:'Settings', path:'/admin', roles:[ROLES.SUPER_ADMIN,ROLES.ADMIN],
    children:[
      { key:'users',        label:'User Management',    path:'/admin' },
      { key:'roles',        label:'Roles & Permissions', path:'/admin/roles' },
      { key:'settings',     label:'System Settings',    path:'/admin/settings' },
      { key:'audit',        label:'Audit Logs',         path:'/admin/audit' },
      { key:'integrations', label:'Integrations',       path:'/admin/integrations' },
    ],
  },
]
export const getNavForRole = (role) =>
  NAV_ITEMS.filter(item => item.roles === 'all' || item.roles?.includes(role))