import { useState } from "react";
import { Download, TrendingUp, TrendingDown, Users, BarChart2, Filter } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const monthlyData = [
  { month: "Jan", casual: 12, sick: 8, earned: 5, lop: 1 },
  { month: "Feb", casual: 9, sick: 14, earned: 3, lop: 0 },
  { month: "Mar", casual: 15, sick: 6, earned: 8, lop: 2 },
  { month: "Apr", casual: 10, sick: 9, earned: 12, lop: 0 },
  { month: "May", casual: 18, sick: 11, earned: 7, lop: 1 },
  { month: "Jun", casual: 22, sick: 7, earned: 9, lop: 3 },
  { month: "Jul", casual: 14, sick: 5, earned: 11, lop: 0 },
];

const pieData = [
  { name: "Casual Leave", value: 100, color: "#f59e0b" },
  { name: "Sick Leave", value: 60, color: "#ef4444" },
  { name: "Earned Leave", value: 55, color: "#00b894" },
  { name: "Comp Off", value: 18, color: "#3b82f6" },
  { name: "LOP", value: 7, color: "#6b7280" },
];

const deptData = [
  { dept: "Engineering", employees: 45, totalLeaves: 128, avgDays: 2.8, lop: 3 },
  { dept: "Sales", employees: 28, totalLeaves: 94, avgDays: 3.4, lop: 7 },
  { dept: "HR", employees: 12, totalLeaves: 31, avgDays: 2.6, lop: 0 },
  { dept: "Finance", employees: 18, totalLeaves: 52, avgDays: 2.9, lop: 1 },
  { dept: "Marketing", employees: 22, totalLeaves: 67, avgDays: 3.0, lop: 2 },
];

const topLeaves = [
  { name: "Rahul Mehta", dept: "Sales", days: 18, type: "Sick Leave" },
  { name: "Priya Sharma", dept: "Engineering", days: 15, type: "Earned Leave" },
  { name: "Anjali Patel", dept: "HR", days: 12, type: "Casual Leave" },
  { name: "Vikram Singh", dept: "Finance", days: 11, type: "Earned Leave" },
  { name: "Sneha Gupta", dept: "Marketing", days: 10, type: "Casual Leave" },
];

const COLORS = { casual: "#f59e0b", sick: "#ef4444", earned: "#00b894", lop: "#6b7280" };

export default function LeaveReports() {
  const [period, setPeriod] = useState("2025");
  const [dept, setDept] = useState("All");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Reports</h1>
          <p className="text-gray-500 text-sm mt-0.5">Analytics and insights for leave utilization</p>
        </div>
        <div className="flex gap-3">
          <select value={period} onChange={e => setPeriod(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00b894]">
            <option>2025</option><option>2024</option>
          </select>
          <select value={dept} onChange={e => setDept(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00b894]">
            <option>All</option><option>Engineering</option><option>Sales</option><option>HR</option><option>Finance</option><option>Marketing</option>
          </select>
          <button className="flex items-center gap-2 bg-[#00b894] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#00a884] transition-colors">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Leaves (YTD)", value: "372", change: "+12%", up: true, icon: BarChart2, color: "text-[#00b894]", bg: "bg-green-50" },
          { label: "Avg Leave/Employee", value: "3.1 days", change: "-0.3", up: false, icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "LOP Instances", value: "13", change: "+2", up: true, icon: TrendingDown, color: "text-red-500", bg: "bg-red-50" },
          { label: "Pending Approvals", value: "7", change: "-3", up: false, icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-50" },
        ].map(c => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 ${c.bg} rounded-xl flex items-center justify-center`}>
                  <Icon size={16} className={c.color} />
                </div>
                <span className={`text-xs font-medium ${c.up ? "text-red-500" : "text-green-500"}`}>{c.change}</span>
              </div>
              <p className="text-2xl font-black text-gray-900">{c.value}</p>
              <p className="text-xs text-gray-400 mt-1">{c.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-5 gap-5">
        <div className="col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Monthly Leave Trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} barSize={8}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Bar dataKey="casual" fill={COLORS.casual} radius={4} name="Casual" />
              <Bar dataKey="sick" fill={COLORS.sick} radius={4} name="Sick" />
              <Bar dataKey="earned" fill={COLORS.earned} radius={4} name="Earned" />
              <Bar dataKey="lop" fill={COLORS.lop} radius={4} name="LOP" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Leave Type Distribution</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dept Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h2 className="font-semibold text-gray-800">Department-wise Summary</h2>
        </div>
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
            <th className="px-6 py-3 text-left">Department</th>
            <th className="px-6 py-3 text-left">Employees</th>
            <th className="px-6 py-3 text-left">Total Leaves</th>
            <th className="px-6 py-3 text-left">Avg Days/Emp</th>
            <th className="px-6 py-3 text-left">LOP Count</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-50">
            {deptData.map(d => (
              <tr key={d.dept} className="hover:bg-gray-50">
                <td className="px-6 py-3 font-medium text-gray-800">{d.dept}</td>
                <td className="px-6 py-3 text-gray-600">{d.employees}</td>
                <td className="px-6 py-3 text-gray-700">{d.totalLeaves}</td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#00b894] rounded-full" style={{ width: `${(d.avgDays / 5) * 100}%` }} />
                    </div>
                    <span className="text-gray-700">{d.avgDays}</span>
                  </div>
                </td>
                <td className="px-6 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${d.lop > 0 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>{d.lop}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Top Leaves */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Top Leave Takers (YTD)</h2>
        <div className="space-y-3">
          {topLeaves.map((e, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="w-5 text-xs font-bold text-gray-300">#{i + 1}</span>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00b894] to-[#00cec9] text-white text-xs font-bold flex items-center justify-center">
                {e.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{e.name}</p>
                <p className="text-xs text-gray-400">{e.dept} · {e.type}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(e.days / 20) * 100}%` }} />
                </div>
                <span className="text-sm font-bold text-gray-700">{e.days}d</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}