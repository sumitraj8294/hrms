import { Briefcase, UserCheck, Clock, XCircle } from 'lucide-react'

const pipeline = [
  { stage:'Applied',    count:48, color:'bg-blue-500',    pct:100 },
  { stage:'Screening',  count:31, color:'bg-violet-500',  pct:65  },
  { stage:'Interview',  count:14, color:'bg-amber-500',   pct:29  },
  { stage:'Offer Sent', count:5,  color:'bg-emerald-500', pct:10  },
  { stage:'Hired',      count:3,  color:'bg-primary',     pct:6   },
]

const openings = [
  { role:'Senior React Developer', dept:'Engineering', count:2, urgent:true  },
  { role:'Product Manager',        dept:'Product',     count:1, urgent:false },
  { role:'Sales Executive',        dept:'Sales',       count:3, urgent:false },
]

export default function RecruitmentSummary() {
  return (
    <div className="bg-white border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-600 text-text-primary">Recruitment Summary</p>
        <button className="text-xs font-600 text-primary hover:underline">View ATS</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        {[
          { label:'Open Roles',   value:'7',  icon:Briefcase,  color:'text-blue-600',    bg:'bg-blue-50'    },
          { label:'In Pipeline',  value:'48', icon:Clock,      color:'text-violet-600',  bg:'bg-violet-50'  },
          { label:'Hired MTD',    value:'3',  icon:UserCheck,  color:'text-emerald-600', bg:'bg-emerald-50' },
          { label:'Rejected',     value:'12', icon:XCircle,    color:'text-red-500',     bg:'bg-red-50'     },
        ].map(s => {
          const Icon = s.icon
          return (
            <div key={s.label} className={`${s.bg} rounded-lg p-2 text-center`}>
              <Icon size={14} className={`${s.color} mx-auto mb-1`}/>
              <p className={`text-base font-800 ${s.color}`}>{s.value}</p>
              <p className="text-[9px] text-text-muted leading-tight">{s.label}</p>
            </div>
          )
        })}
      </div>

      {/* Funnel */}
      <div className="mb-3">
        <p className="text-[10px] font-700 text-text-muted uppercase tracking-wide mb-2">Hiring Funnel</p>
        <div className="space-y-1.5">
          {pipeline.map(p => (
            <div key={p.stage} className="flex items-center gap-2">
              <span className="text-[10px] text-text-secondary w-20 flex-shrink-0">{p.stage}</span>
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${p.color} rounded-full transition-all`} style={{width:`${p.pct}%`}}/>
              </div>
              <span className="text-[10px] font-700 text-text-primary w-5 text-right">{p.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Open roles */}
      <div className="border-t border-border pt-3">
        <p className="text-[10px] font-700 text-text-muted uppercase tracking-wide mb-2">Open Positions</p>
        <div className="space-y-1.5">
          {openings.map((o,i) => (
            <div key={i} className="flex items-center justify-between">
              <div>
                <p className="text-xs font-600 text-text-primary">{o.role}</p>
                <p className="text-[10px] text-text-muted">{o.dept}</p>
              </div>
              <div className="flex items-center gap-2">
                {o.urgent && <span className="text-[9px] font-700 text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full">Urgent</span>}
                <span className="text-[10px] font-700 text-text-primary bg-slate-100 px-2 py-0.5 rounded-full">{o.count} pos</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}