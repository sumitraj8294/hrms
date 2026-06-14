import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const leaveTypes = [
  { name:'Casual Leave', availed:6.8, balance:5.2, color:'#6c5ce7' },
  { name:'Sick Leave',   availed:3.0, balance:6.0, color:'#0984e3' },
  { name:'Earned Leave', availed:2.5, balance:12.5,color:'#00b894' },
  { name:'Comp Off',     availed:1.0, balance:2.0, color:'#fdcb6e' },
]

const pie = leaveTypes.map(l => ({ name: l.name, value: l.availed, color: l.color }))

const pending = [
  { name:'Priya Sharma', type:'Sick Leave',   days:2, date:'Jun 12–13' },
  { name:'Rahul Verma',  type:'Casual Leave', days:3, date:'Jun 18–20' },
]

export default function LeaveSummary() {
  return (
    <div className="bg-white border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-600 text-text-primary">Leave Summary</p>
        <button className="text-xs font-600 text-primary hover:underline">View All</button>
      </div>

      <div className="flex items-center gap-4 mb-3">
        {/* Mini pie */}
        <div className="flex-shrink-0">
          <ResponsiveContainer width={80} height={80}>
            <PieChart>
              <Pie data={pie} dataKey="value" cx="50%" cy="50%" innerRadius={22} outerRadius={38} paddingAngle={2}>
                {pie.map((e,i) => <Cell key={i} fill={e.color}/>)}
              </Pie>
              <Tooltip contentStyle={{fontSize:11, borderRadius:8}}/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-1.5">
          {leaveTypes.map(l => (
            <div key={l.name} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:l.color}}/>
                <span className="text-[10px] text-text-secondary truncate">{l.name}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-[10px] font-600 text-text-muted">Used: {l.availed}</span>
                <span className="text-[10px] font-600 text-emerald-600">Bal: {l.balance}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending requests */}
      {pending.length > 0 && (
        <div className="border-t border-border pt-3">
          <p className="text-[10px] font-700 text-text-muted uppercase tracking-wide mb-2">Pending Requests</p>
          <div className="space-y-1.5">
            {pending.map((p,i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-600 text-text-primary">{p.name}</p>
                  <p className="text-[10px] text-text-muted">{p.type} · {p.date}</p>
                </div>
                <span className="text-[10px] font-700 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">{p.days}d</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}