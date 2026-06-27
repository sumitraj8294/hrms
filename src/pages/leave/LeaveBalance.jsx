import { useState } from "react";
import { Umbrella, Sun, Heart, Baby, Clock, TrendingUp, Download } from "lucide-react";

const leaveTypes = [
  { name: "Casual Leave", icon: Sun, total: 12, used: 4, pending: 1, color: "#f59e0b", bg: "bg-amber-50" },
  { name: "Sick Leave", icon: Heart, total: 10, used: 2, pending: 0, color: "#ef4444", bg: "bg-red-50" },
  { name: "Earned Leave", icon: TrendingUp, total: 15, used: 6, pending: 2, color: "#00b894", bg: "bg-green-50" },
  { name: "Maternity Leave", icon: Baby, total: 180, used: 0, pending: 0, color: "#8b5cf6", bg: "bg-violet-50" },
  { name: "Comp Off", icon: Clock, total: 3, used: 1, pending: 0, color: "#3b82f6", bg: "bg-blue-50" },
  { name: "LOP", icon: Umbrella, total: 0, used: 2, pending: 0, color: "#6b7280", bg: "bg-gray-50" },
];

const history = [
  { type: "Casual Leave", from: "2025-06-10", to: "2025-06-11", days: 2, status: "Approved", reason: "Personal work" },
  { type: "Sick Leave", from: "2025-05-20", to: "2025-05-20", days: 1, status: "Approved", reason: "Fever" },
  { type: "Earned Leave", from: "2025-04-14", to: "2025-04-18", days: 5, status: "Approved", reason: "Family vacation" },
  { type: "Casual Leave", from: "2025-07-01", to: "2025-07-01", days: 1, status: "Pending", reason: "Personal" },
  { type: "Earned Leave", from: "2025-07-15", to: "2025-07-16", days: 2, status: "Pending", reason: "Travel" },
];

const statusStyle = { Approved: "bg-green-100 text-green-700", Pending: "bg-amber-100 text-amber-700", Rejected: "bg-red-100 text-red-700" };

export default function LeaveBalance() {
  const [year, setYear] = useState("2025");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Balance</h1>
          <p className="text-gray-500 text-sm mt-0.5">Your leave entitlements and usage</p>
        </div>
        <div className="flex gap-3">
          <select value={year} onChange={e => setYear(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00b894]">
            <option>2025</option><option>2024</option>
          </select>
          <button className="flex items-center gap-2 bg-[#00b894] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#00a884] transition-colors">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {leaveTypes.map(lt => {
          const Icon = lt.icon;
          const available = lt.total - lt.used - lt.pending;
          const pct = lt.total > 0 ? Math.round((lt.used / lt.total) * 100) : 0;
          return (
            <div key={lt.name} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl ${lt.bg} flex items-center justify-center`}>
                  <Icon size={18} style={{ color: lt.color }} />
                </div>
                <span className="font-semibold text-gray-800 text-sm">{lt.name}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>Used {lt.used}</span>
                <span>Total {lt.total}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: lt.color }} />
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Pending: <b className="text-amber-500">{lt.pending}</b></span>
                <span className="font-bold" style={{ color: lt.color }}>{available} left</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Leave History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <th className="px-6 py-3 text-left">Type</th>
              <th className="px-6 py-3 text-left">From</th>
              <th className="px-6 py-3 text-left">To</th>
              <th className="px-6 py-3 text-left">Days</th>
              <th className="px-6 py-3 text-left">Reason</th>
              <th className="px-6 py-3 text-left">Status</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {history.map((h, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 font-medium text-gray-800">{h.type}</td>
                  <td className="px-6 py-3 text-gray-600">{h.from}</td>
                  <td className="px-6 py-3 text-gray-600">{h.to}</td>
                  <td className="px-6 py-3 text-gray-700 font-medium">{h.days}</td>
                  <td className="px-6 py-3 text-gray-500 max-w-xs truncate">{h.reason}</td>
                  <td className="px-6 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle[h.status]}`}>{h.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}