import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

const monthlyData = [
  { month:'Jan', amount:22.1 }, { month:'Feb', amount:21.8 },
  { month:'Mar', amount:23.2 }, { month:'Apr', amount:22.9 },
  { month:'May', amount:24.6 }, { month:'Jun', amount:0    },
]

const breakdown = [
  { label:'Gross Payroll',  value:'₹28.4L', sub:'Before deductions',  color:'text-text-primary'   },
  { label:'PF Deduction',   value:'₹2.1L',  sub:'Employee + Employer', color:'text-violet-600'     },
  { label:'TDS Deducted',   value:'₹1.5L',  sub:'Income tax',          color:'text-amber-600'      },
  { label:'Net Disbursed',  value:'₹24.6L', sub:'May 2024',            color:'text-emerald-600'    },
]

export default function PayrollInsights() {
  return (
    <div className="bg-white border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-600 text-text-primary">Payroll Insights</p>
        <div className="flex items-center gap-1 text-emerald-600">
          <TrendingUp size={12}/>
          <span className="text-[10px] font-600">+7.4% vs last month</span>
        </div>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {breakdown.map(b => (
          <div key={b.label} className="bg-slate-50 rounded-lg p-2.5">
            <p className={`text-base font-800 leading-none ${b.color}`}>{b.value}</p>
            <p className="text-[10px] font-600 text-text-primary mt-0.5">{b.label}</p>
            <p className="text-[9px] text-text-muted">{b.sub}</p>
          </div>
        ))}
      </div>

      {/* Trend chart */}
      <div>
        <p className="text-[10px] font-700 text-text-muted uppercase tracking-wide mb-1.5">6-Month Trend (₹ in Lakhs)</p>
        <ResponsiveContainer width="100%" height={70}>
          <BarChart data={monthlyData} barSize={16}>
            <XAxis dataKey="month" tick={{fontSize:9, fill:'#94a3b8'}} axisLine={false} tickLine={false}/>
            <Tooltip
              formatter={(v) => [`₹${v}L`, 'Payroll']}
              contentStyle={{fontSize:11, borderRadius:8, border:'1px solid #e2e8f0'}}
            />
            <Bar dataKey="amount" radius={[3,3,0,0]}>
              {monthlyData.map((e,i) => (
                <rect key={i} fill={i === 4 ? '#00b894' : '#e2e8f0'}/>
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
        <p className="text-[10px] text-text-muted">248 employees · May 2024</p>
        <button className="text-xs font-600 text-primary hover:underline">View Full Report</button>
      </div>
    </div>
  )
}