import { useState } from "react";
import { Search, Check, X, Eye, Filter, ChevronDown } from "lucide-react";

const mock = [
  { id: 1, name: "Priya Sharma", avatar: "PS", dept: "Engineering", type: "Casual Leave", from: "2025-07-10", to: "2025-07-11", days: 2, reason: "Personal work", applied: "2025-07-05", status: "Pending" },
  { id: 2, name: "Rahul Mehta", avatar: "RM", dept: "Sales", type: "Sick Leave", from: "2025-07-08", to: "2025-07-08", days: 1, reason: "Fever and cold", applied: "2025-07-07", status: "Pending" },
  { id: 3, name: "Anjali Patel", avatar: "AP", dept: "HR", type: "Earned Leave", from: "2025-07-14", to: "2025-07-18", days: 5, reason: "Family vacation", applied: "2025-06-30", status: "Pending" },
  { id: 4, name: "Vikram Singh", avatar: "VS", dept: "Finance", type: "Casual Leave", from: "2025-06-25", to: "2025-06-25", days: 1, reason: "Personal", applied: "2025-06-20", status: "Approved" },
  { id: 5, name: "Sneha Gupta", avatar: "SG", dept: "Marketing", type: "Comp Off", from: "2025-06-20", to: "2025-06-20", days: 1, reason: "Comp off for weekend work", applied: "2025-06-18", status: "Rejected" },
];

const colors = ["bg-violet-500", "bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-pink-500"];
const statusStyle = { Approved: "bg-green-100 text-green-700", Pending: "bg-amber-100 text-amber-700", Rejected: "bg-red-100 text-red-700" };

export default function LeaveApproval() {
  const [data, setData] = useState(mock);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [remark, setRemark] = useState("");

  const filtered = data.filter(r =>
    (filter === "All" || r.status === filter) &&
    (r.name.toLowerCase().includes(search.toLowerCase()) || r.type.toLowerCase().includes(search.toLowerCase()))
  );

  const act = (id, action) => {
    setData(d => d.map(r => r.id === id ? { ...r, status: action } : r));
    setSelected(null); setRemark("");
  };

  const pending = data.filter(r => r.status === "Pending").length;

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Approvals</h1>
          <p className="text-gray-500 text-sm mt-0.5">{pending} request{pending !== 1 ? "s" : ""} pending your action</p>
        </div>
        <div className="flex gap-3">
          {["All","Pending","Approved","Rejected"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f ? "bg-[#00b894] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {f} {f === "Pending" && pending > 0 && <span className="ml-1 bg-amber-500 text-white text-xs rounded-full px-1.5">{pending}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-3 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or leave type..."
          className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00b894]" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
            <th className="px-6 py-3 text-left">Employee</th>
            <th className="px-6 py-3 text-left">Leave Type</th>
            <th className="px-6 py-3 text-left">Duration</th>
            <th className="px-6 py-3 text-left">Days</th>
            <th className="px-6 py-3 text-left">Applied</th>
            <th className="px-6 py-3 text-left">Status</th>
            <th className="px-6 py-3 text-left">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((r, i) => (
              <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${colors[i % 5]} text-white text-xs font-bold flex items-center justify-center`}>{r.avatar}</div>
                    <div>
                      <p className="font-medium text-gray-800">{r.name}</p>
                      <p className="text-xs text-gray-400">{r.dept}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3 text-gray-700">{r.type}</td>
                <td className="px-6 py-3 text-gray-500 text-xs">{r.from} → {r.to}</td>
                <td className="px-6 py-3 font-semibold text-gray-800">{r.days}d</td>
                <td className="px-6 py-3 text-gray-400 text-xs">{r.applied}</td>
                <td className="px-6 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle[r.status]}`}>{r.status}</span></td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => setSelected(r)} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Eye size={14} /></button>
                    {r.status === "Pending" && <>
                      <button onClick={() => act(r.id, "Approved")} className="p-1.5 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors"><Check size={14} /></button>
                      <button onClick={() => act(r.id, "Rejected")} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><X size={14} /></button>
                    </>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="text-center py-12 text-gray-400">No leave requests found</div>}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 text-lg">Leave Request Details</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="space-y-3 text-sm mb-4">
              {[["Employee", selected.name], ["Department", selected.dept], ["Leave Type", selected.type], ["From", selected.from], ["To", selected.to], ["Days", selected.days], ["Reason", selected.reason], ["Applied On", selected.applied]].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-gray-400">{k}</span>
                  <span className="font-medium text-gray-800">{v}</span>
                </div>
              ))}
            </div>
            {selected.status === "Pending" && <>
              <textarea value={remark} onChange={e => setRemark(e.target.value)} placeholder="Add remark (optional)" rows={2}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00b894] resize-none mb-4" />
              <div className="flex gap-3">
                <button onClick={() => act(selected.id, "Rejected")} className="flex-1 flex items-center justify-center gap-2 border border-red-200 text-red-500 py-2.5 rounded-xl font-medium hover:bg-red-50 transition-colors">
                  <X size={14} /> Reject
                </button>
                <button onClick={() => act(selected.id, "Approved")} className="flex-1 flex items-center justify-center gap-2 bg-[#00b894] text-white py-2.5 rounded-xl font-medium hover:bg-[#00a884] transition-colors">
                  <Check size={14} /> Approve
                </button>
              </div>
            </>}
          </div>
        </div>
      )}
    </div>
  );
}