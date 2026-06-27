import { useState } from "react";
import { Clock, Plus, CheckCircle, X, AlertCircle } from "lucide-react";

const myCompOffs = [
  { date: "2025-06-28", reason: "Worked on Saturday release deployment", hours: 8, status: "Approved", expires: "2025-07-28" },
  { date: "2025-06-15", reason: "Sunday production issue fix", hours: 6, status: "Approved", expires: "2025-07-15" },
  { date: "2025-07-05", reason: "Weekend sprint completion", hours: 4, status: "Pending", expires: "—" },
];

const usageHistory = [
  { date: "2025-07-02", days: 1, status: "Approved", against: "2025-06-28" },
];

const statusStyle = { Approved: "bg-green-100 text-green-700", Pending: "bg-amber-100 text-amber-700", Rejected: "bg-red-100 text-red-700" };

export default function CompOff() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: "", hours: "", reason: "", useDate: "" });
  const [tab, setTab] = useState("earn");
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const available = myCompOffs.filter(c => c.status === "Approved").reduce((s, c) => s + (c.hours >= 8 ? 1 : 0.5), 0);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Comp Off</h1>
          <p className="text-gray-500 text-sm mt-0.5">Compensatory off for extra hours worked</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-[#00b894] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#00a884] transition-colors">
          <Plus size={14} /> Request Comp Off
        </button>
      </div>

      {/* Balance Card */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Available Balance", value: `${available} days`, color: "text-[#00b894]", bg: "bg-green-50" },
          { label: "Pending Approval", value: "0.5 days", color: "text-amber-500", bg: "bg-amber-50" },
          { label: "Expires This Month", value: "1 day", color: "text-red-500", bg: "bg-red-50" },
        ].map(c => (
          <div key={c.label} className={`${c.bg} rounded-2xl p-5`}>
            <p className="text-xs text-gray-500 mb-1">{c.label}</p>
            <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {["earn", "use"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? "bg-white shadow text-gray-800" : "text-gray-500"}`}>
            {t === "earn" ? "Earned Comp Offs" : "Usage History"}
          </button>
        ))}
      </div>

      {tab === "earn" ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <th className="px-6 py-3 text-left">Work Date</th>
              <th className="px-6 py-3 text-left">Reason</th>
              <th className="px-6 py-3 text-left">Hours</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Expires</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {myCompOffs.map((c, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-800">{c.date}</td>
                  <td className="px-6 py-3 text-gray-600 max-w-xs truncate">{c.reason}</td>
                  <td className="px-6 py-3 text-gray-700">{c.hours}h</td>
                  <td className="px-6 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle[c.status]}`}>{c.status}</span></td>
                  <td className="px-6 py-3 text-gray-500">{c.expires}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <th className="px-6 py-3 text-left">Availed On</th>
              <th className="px-6 py-3 text-left">Days Used</th>
              <th className="px-6 py-3 text-left">Against Work Date</th>
              <th className="px-6 py-3 text-left">Status</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {usageHistory.map((u, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-800">{u.date}</td>
                  <td className="px-6 py-3 text-gray-700">{u.days}</td>
                  <td className="px-6 py-3 text-gray-500">{u.against}</td>
                  <td className="px-6 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle[u.status]}`}>{u.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-900 text-lg">Request Comp Off</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Date Worked <span className="text-red-500">*</span></label>
                <input type="date" value={form.date} onChange={e => set("date", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00b894]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Hours Worked <span className="text-red-500">*</span></label>
                <input type="number" min="1" max="12" value={form.hours} onChange={e => set("hours", e.target.value)} placeholder="e.g. 8"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00b894]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason <span className="text-red-500">*</span></label>
                <textarea value={form.reason} onChange={e => set("reason", e.target.value)} rows={3} placeholder="Describe the work done..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00b894] resize-none" />
              </div>
              <div className="flex items-start gap-2 bg-blue-50 p-3 rounded-xl">
                <AlertCircle size={14} className="text-blue-500 mt-0.5 shrink-0" />
                <p className="text-xs text-blue-600">Comp off must be availed within 30 days of approval. 8+ hours = 1 day; 4–7 hours = 0.5 day.</p>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl font-medium text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={() => setShowForm(false)} className="flex-1 bg-[#00b894] text-white py-2.5 rounded-xl font-medium text-sm hover:bg-[#00a884]">Submit Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}