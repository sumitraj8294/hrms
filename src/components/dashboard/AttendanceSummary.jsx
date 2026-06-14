import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const weekData = [
  { day:'Mon', present:210, absent:38  },
  { day:'Tue', present:225, absent:23  },
  { day:'Wed', present:198, absent:50  },
  { day:'Thu', present:220, absent:28  },
  { day:'Fri', present:196, absent:52  },
  { day:'Sat', present:80,  absent:168 },
]

const stats = [
  { label:'Present',     value:'196', pct:'79%',  color:'text-emerald-600', dot:'bg-emerald-500' },
  { label:'Absent',      value:'52',  pct:'21%',  color:'text-red-500',     dot:'bg-red-400'     },
  { label:'Late Arrivals',value:'24', pct:'9.7%', color:'text-amber-600',   dot:'bg-amber-400'   },
  { label:'On Leave',    value:'18',  pct:'7.3%', color:'text-blue-600',    dot:'bg-blue-400'    },
]

export default function AttendanceSummary() {
  return (
    <div className="bg-white border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-600 text-text-primary">Attendance Summary</p>
        <span className="text-[10px] text-text-muted bg-slate-100 px-2 py-0.5 rounded-full font-500">This Week</span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        {stats.map(s => (
          <div key={s.label} className="text-center">
            <p className={`text-base font-800 ${s.color}`}>{s.value}</p>
            <p className="text-[9px] text-text-muted mt-0.5 leading-tight">{s.label}</p>
            <p className={`text-[9px] font-600 ${s.color}`}>{s.pct}</p>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <ResponsiveContainer width="100%" height={90}>
        <BarChart data={weekData} barSize={10} barGap={2}>
          <XAxis dataKey="day" tick={{fontSize:9, fill:'#94a3b8'}} axisLine={false} tickLine={false}/>
          <Tooltip
            contentStyle={{fontSize:11, borderRadius:8, border:'1px solid #e2e8f0', padding:'6px 10px'}}
            cursor={{fill:'rgba(0,0,0,0.03)'}}
          />
          <Bar dataKey="present" fill="#00b894" radius={[3,3,0,0]} name="Present"/>
          <Bar dataKey="absent"  fill="#fde8e8" radius={[3,3,0,0]} name="Absent"/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}