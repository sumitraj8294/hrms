import { useState } from 'react'
import { Bell, TrendingUp, TrendingDown, Globe } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { useAuth } from '@/context/AuthContext'

import KPIWidgets     from '@/components/dashboard/KPIWidgets'
import NotificationsPanel from '@/components/dashboard/NotificationsPanel'
import PayrollInsights    from '@/components/dashboard/PayrollInsights'
import RecruitmentSummary from '@/components/dashboard/RecruitmentSummary'
import CompanyFeed        from '@/components/dashboard/CompanyFeed'

const headcountTrend = [
  {m:'Jan',hc:220},{m:'Feb',hc:225},{m:'Mar',hc:230},
  {m:'Apr',hc:238},{m:'May',hc:245},{m:'Jun',hc:248},
]
const attritionTrend = [
  {m:'Jan',rate:4.1},{m:'Feb',rate:3.8},{m:'Mar',rate:4.2},
  {m:'Apr',rate:3.5},{m:'May',rate:3.2},{m:'Jun',rate:0},
]

const deptMetrics = [
  { dept:'Engineering', headcount:85,  payroll:'₹9.8L', attrition:'2.1%' },
  { dept:'Sales',       headcount:42,  payroll:'₹4.2L', attrition:'5.2%' },
  { dept:'HR',          headcount:18,  payroll:'₹1.8L', attrition:'1.0%' },
  { dept:'Finance',     headcount:25,  payroll:'₹3.1L', attrition:'2.5%' },
  { dept:'Operations',  headcount:38,  payroll:'₹3.5L', attrition:'3.8%' },
]

export default function ExecutiveDashboard() {
  const { user } = useAuth()
  const [showNotif, setShowNotif] = useState(false)

  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-y-auto">

        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <div>
            <h2 className="font-700 text-text-primary">Executive Overview</h2>
            <p className="text-xs text-text-muted">Organisation-wide insights · May 2024</p>
          </div>
          <div className="relative">
            <button onClick={() => setShowNotif(v => !v)}
              className="relative w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center text-text-secondary hover:text-primary transition-colors">
              <Bell size={15}/>
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full"/>
            </button>
            {showNotif && (
              <div className="absolute right-0 top-10 z-50">
                <NotificationsPanel onClose={() => setShowNotif(false)}/>
              </div>
            )}
          </div>
        </div>

        <div className="px-5 pb-5 space-y-3">

          <KPIWidgets />

          {/* Headcount & Attrition charts */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-600 text-text-primary">Headcount Trend</p>
                <span className="flex items-center gap-1 text-[10px] font-600 text-emerald-600"><TrendingUp size={11}/>+12.7%</span>
              </div>
              <ResponsiveContainer width="100%" height={100}>
                <LineChart data={headcountTrend}>
                  <XAxis dataKey="m" tick={{fontSize:9,fill:'#94a3b8'}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:9,fill:'#94a3b8'}} axisLine={false} tickLine={false} domain={[210,255]}/>
                  <Tooltip contentStyle={{fontSize:11,borderRadius:8,border:'1px solid #e2e8f0'}}/>
                  <Line type="monotone" dataKey="hc" stroke="#00b894" strokeWidth={2} dot={false}/>
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-600 text-text-primary">Attrition Rate</p>
                <span className="flex items-center gap-1 text-[10px] font-600 text-emerald-600"><TrendingDown size={11}/>Improving</span>
              </div>
              <ResponsiveContainer width="100%" height={100}>
                <BarChart data={attritionTrend} barSize={14}>
                  <XAxis dataKey="m" tick={{fontSize:9,fill:'#94a3b8'}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:9,fill:'#94a3b8'}} axisLine={false} tickLine={false}/>
                  <Tooltip contentStyle={{fontSize:11,borderRadius:8,border:'1px solid #e2e8f0'}} formatter={(v)=>[`${v}%`,'Rate']}/>
                  <Bar dataKey="rate" fill="#6c5ce7" radius={[3,3,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Dept breakdown */}
          <div className="bg-white border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Globe size={14} className="text-text-muted"/>
                <p className="text-sm font-600 text-text-primary">Department Overview</p>
              </div>
              <button className="text-xs font-600 text-primary hover:underline">Full Report</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    {['Department','Headcount','Payroll','Attrition'].map(h => (
                      <th key={h} className="text-left pb-2 text-[10px] font-700 text-text-muted uppercase tracking-wide pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {deptMetrics.map((d,i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2 pr-4 font-600 text-text-primary">{d.dept}</td>
                      <td className="py-2 pr-4 text-text-secondary">{d.headcount}</td>
                      <td className="py-2 pr-4 text-text-secondary">{d.payroll}</td>
                      <td className={`py-2 font-700 ${parseFloat(d.attrition) > 4 ? 'text-red-500' : 'text-emerald-600'}`}>{d.attrition}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <PayrollInsights />
            <RecruitmentSummary />
          </div>

        </div>
      </div>

      <div className="w-[340px] flex-shrink-0 border-l border-border bg-white overflow-hidden flex flex-col">
        <CompanyFeed />
      </div>
    </div>
  )
}