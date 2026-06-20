import { useState } from 'react'
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Users,
  Link2,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Avatar from '@/components/ui/Avatar'

const ORG = {
  name: 'Raj Mehta',
  role: 'CEO',
  dept: 'Executive',
  secondaryReports: [],
  children: [
    {
      name: 'Neha Kapoor',
      role: 'VP Engineering',
      dept: 'Engineering',
      secondaryReports: [],
      children: [
        {
          name: 'Priya Sharma',
          role: 'Tech Lead',
          dept: 'Engineering',
          secondaryReports: ['Ravi Kumar'],
          children: [
            {
              name: 'Rahul Verma',
              role: 'Sr. Developer',
              dept: 'Engineering',
              secondaryReports: ['Arjun Singh'],
              children: [],
            },
            {
              name: 'Siddharth K.',
              role: 'Backend Developer',
              dept: 'Engineering',
              secondaryReports: [],
              children: [],
            },
          ],
        },
      ],
    },
    {
      name: 'Pooja Iyer',
      role: 'VP Sales',
      dept: 'Sales',
      secondaryReports: [],
      children: [
        {
          name: 'Arjun Singh',
          role: 'Sales Lead',
          dept: 'Sales',
          secondaryReports: [],
          children: [
            {
              name: 'Kavya Nair',
              role: 'Sales Executive',
              dept: 'Sales',
              secondaryReports: ['Priya Sharma'],
              children: [],
            },
          ],
        },
      ],
    },
    {
      name: 'Ravi Kumar',
      role: 'VP HR',
      dept: 'HR',
      secondaryReports: [],
      children: [
        {
          name: 'Divya S.',
          role: 'HR Manager',
          dept: 'HR',
          secondaryReports: ['Neha Kapoor'],
          children: [],
        },
      ],
    },
  ],
}

const DEPT_COLORS = {
  Executive: {
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
    border: 'border-violet-200',
    badge: 'bg-violet-100 text-violet-700',
    shadow: 'shadow-violet-100',
  },
  Engineering: {
    gradient: 'from-blue-500 via-cyan-500 to-sky-500',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-700',
    shadow: 'shadow-blue-100',
  },
  Sales: {
    gradient: 'from-emerald-500 via-teal-500 to-green-500',
    border: 'border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-700',
    shadow: 'shadow-emerald-100',
  },
  HR: {
    gradient: 'from-pink-500 via-rose-500 to-red-500',
    border: 'border-pink-200',
    badge: 'bg-pink-100 text-pink-700',
    shadow: 'shadow-pink-100',
  },
}

function OrgNode({ node, level = 0 }) {
  const [open, setOpen] = useState(level < 2)

  const hasChildren = node.children?.length > 0

  const style = DEPT_COLORS[node.dept] || {
    gradient: 'from-slate-500 to-slate-600',
    border: 'border-slate-200',
    badge: 'bg-slate-100 text-slate-700',
    shadow: 'shadow-slate-100',
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className={`
          relative z-10 flex flex-col items-center
          min-w-[230px] max-w-[230px]
          rounded-3xl border ${style.border}
          bg-white/90 backdrop-blur-xl
          px-5 py-5
          shadow-xl ${style.shadow}
          hover:-translate-y-1 hover:shadow-2xl
          transition-all duration-300
        `}
      >
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/60 to-transparent pointer-events-none" />

        <div
          className={`mb-4 rounded-full bg-gradient-to-br ${style.gradient} p-[3px]`}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white">
            <Avatar
              name={node.name}
              className="h-14 w-14 text-sm font-bold"
            />
          </div>
        </div>

        <h3 className="text-sm font-bold text-text-primary text-center">
          {node.name}
        </h3>

        <p className="mt-1 text-xs text-text-muted text-center">
          {node.role}
        </p>

        <span
          className={`mt-3 rounded-full px-3 py-1 text-[10px] font-semibold ${style.badge}`}
        >
          {node.dept}
        </span>

        {node.secondaryReports?.length > 0 && (
          <div className="mt-4 w-full border-t border-dashed border-amber-300 pt-3">
            <div className="mb-2 flex items-center justify-center gap-1 text-amber-600">
              <Link2 size={12} />
              <span className="text-[10px] font-medium">
                Secondary Reporting
              </span>
            </div>

            <div className="flex flex-wrap justify-center gap-1.5">
              {node.secondaryReports.map((report) => (
                <span
                  key={report}
                  className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-medium text-amber-700"
                >
                  {report}
                </span>
              ))}
            </div>
          </div>
        )}

        {hasChildren && (
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="
              absolute -bottom-4
              flex h-8 w-8 items-center justify-center
              rounded-full border-2 border-slate-200
              bg-white shadow-md
              transition-all hover:scale-110 hover:border-primary
            "
          >
            {open ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )}
          </button>
        )}
      </div>

      {hasChildren && open && (
        <div className="relative mt-10 flex flex-col items-center">
          {/* Parent vertical connector */}
          <div className="h-8 w-1 rounded-full bg-slate-400" />

          {/* Horizontal connector */}
          <div className="relative">
            <div className="absolute left-12 right-12 top-0 h-1 rounded-full bg-slate-400" />

            <div className="flex gap-10 pt-1">
              {node.children.map((child, index) => (
                <div
                  key={`${child.name}-${index}`}
                  className="relative flex flex-col items-center"
                >
                  {/* Child vertical connector */}
                  <div className="h-8 w-1 rounded-full bg-slate-400" />

                  {/* Dotted secondary indicator */}
                  {child.secondaryReports?.length > 0 && (
                    <div className="absolute top-4 left-full ml-2 w-8 border-t-2 border-dashed border-amber-400" />
                  )}

                  <OrgNode node={child} level={level + 1} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function OrgChart() {
  const navigate = useNavigate()

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex items-center gap-3 border-b border-border bg-white px-6 py-4">
        <button
          onClick={() => navigate('/core-hr')}
          className="rounded-lg p-2 text-text-muted transition-colors hover:bg-slate-100 hover:text-primary"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-violet-100 p-2 text-violet-600">
            <Users size={18} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-text-primary">
              Organisation Chart
            </h2>
            <p className="text-xs text-text-muted">
              Company hierarchy and reporting structure
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 via-violet-50/30 to-cyan-50/30 p-8">
        <div className="min-w-max flex justify-center pb-10">
          <OrgNode node={ORG} />
        </div>
      </div>
    </div>
  )
}