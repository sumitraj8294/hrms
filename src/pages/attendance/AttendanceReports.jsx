import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const weekly = [
  {day:'Mon',present:210,absent:38},{day:'Tue',present:225,absent:23},
  {day:'Wed',present:198,absent:50},{day:'Thu',present:220,absent:28},
  {day:'Fri',present:196,absent:52},{day:'Sat',present:80,absent:168},
]
const monthly = [
  {month:'Jan',rate:91},{month:'Feb',rate:88},{month:'Mar',rate:93},
  {month:'Apr',rate:89},{month:'May',rate:92},{month:'Jun',rate:87},
]

export default function AttendanceReports() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-4 pb-3 border-b border-border bg-white">
        <h2 className="font-700 text-text-primary">Attendance Reports</h2>
        <p className="text-xs text-text-muted mt-0.5">Trends and analytics overview</p>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <div className="grid grid-cols-4 gap-3">
          {[
            {label:'Avg Attendance Rate', value:'91%',  grad:'from-emerald-500 to-teal-400'},
            {label:'Present Today',       value:'196',  grad:'from-blue-500 to-cyan-400'   },
            {label:'Absent Today',        value:'52',   grad:'from-red-500 to-rose-400'    },
            {label:'Late Arrivals',       value:'24',   grad:'from-amber-500 to-yellow-400'},
          ].map(s => (
            <div key={s.label} className="relative bg-white border border-border rounded-xl p-4 overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${s.grad} opacity-[0.05]`}/>
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${s.grad}`}/>
              <p className="relative text-2xl font-800 text-text-primary">{s.value}</p>
              <p className="relative text-xs text-text-muted mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-border rounded-xl p-5">
            <p className="text-sm font-700 text-text-primary mb-4">This Week — Present vs Absent</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={weekly} barSize={14} barGap={4}>
                <XAxis dataKey="day" tick={{fontSize:11,fill:'#94a3b8'}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:11,fill:'#94a3b8'}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{fontSize:12,borderRadius:8,border:'1px solid #e2e8f0'}}/>
                <Bar dataKey="present" fill="#00b894" radius={[4,4,0,0]} name="Present"/>
                <Bar dataKey="absent"  fill="#fde8e8" radius={[4,4,0,0]} name="Absent"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white border border-border rounded-xl p-5">
            <p className="text-sm font-700 text-text-primary mb-4">Monthly Attendance Rate (%)</p>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={monthly}>
                <XAxis dataKey="month" tick={{fontSize:11,fill:'#94a3b8'}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:11,fill:'#94a3b8'}} axisLine={false} tickLine={false} domain={[80,100]}/>
                <Tooltip contentStyle={{fontSize:12,borderRadius:8,border:'1px solid #e2e8f0'}} formatter={v=>[`${v}%`]}/>
                <Line type="monotone" dataKey="rate" stroke="#6c5ce7" strokeWidth={2} dot={false}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-700">
          ℹ️ Connect backend API to see real-time data. Department-wise and employee-wise breakdown coming soon.
        </div>
      </div>
    </div>
  )
}