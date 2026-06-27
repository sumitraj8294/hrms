import { useState } from "react";
import { BookOpen, ChevronDown, ChevronUp, Plus, Edit2, Trash2, Shield } from "lucide-react";

const policies = [
  {
    id: 1, name: "Casual Leave", accrual: "1/month", maxAccrual: 12, carryForward: 0, encashable: false,
    minService: "0 days", halfDay: true, proRated: true, gender: "All",
    rules: ["Maximum 3 consecutive days allowed", "Requires 1 day prior notice", "Cannot be combined with other leave types", "Not encashable at year end"]
  },
  {
    id: 2, name: "Sick Leave", accrual: "Upfront (yearly)", maxAccrual: 10, carryForward: 5, encashable: false,
    minService: "0 days", halfDay: true, proRated: false, gender: "All",
    rules: ["Medical certificate required for 3+ consecutive days", "Can carry forward up to 5 days", "Half-day allowed", "No prior notice required"]
  },
  {
    id: 3, name: "Earned Leave", accrual: "1.25/month", maxAccrual: 15, carryForward: 15, encashable: true,
    minService: "6 months", halfDay: false, proRated: true, gender: "All",
    rules: ["Minimum 6 months of service required", "Requires 3 days prior approval", "Can carry forward up to 15 days", "Encashable during exit or at year end (max 10 days)"]
  },
  {
    id: 4, name: "Maternity Leave", accrual: "One-time", maxAccrual: 180, carryForward: 0, encashable: false,
    minService: "80 days (last 12 months)", halfDay: false, proRated: false, gender: "Female",
    rules: ["180 days for first 2 children, 12 weeks thereafter", "6 weeks mandatory post-natal leave", "Medical certificate from doctor required", "Applicable as per Maternity Benefit Act 1961"]
  },
  {
    id: 5, name: "Paternity Leave", accrual: "One-time", maxAccrual: 5, carryForward: 0, encashable: false,
    minService: "1 year", halfDay: false, proRated: false, gender: "Male",
    rules: ["5 days within 3 months of childbirth", "Requires birth certificate copy", "Can be taken before or after delivery", "One-time benefit per child"]
  },
  {
    id: 6, name: "Comp Off", accrual: "Per extra day worked", maxAccrual: 6, carryForward: 0, encashable: false,
    minService: "0 days", halfDay: true, proRated: false, gender: "All",
    rules: ["Must be availed within 30 days of approval", "Requires manager approval for work done on off day", "8+ hrs = 1 day; 4–7 hrs = 0.5 day", "Max 2 comp-offs per month"]
  },
];

const genderBadge = { All: "bg-gray-100 text-gray-600", Female: "bg-pink-100 text-pink-600", Male: "bg-blue-100 text-blue-600" };

export default function LeavePolicies() {
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState("");
  const toggle = id => setExpanded(e => e === id ? null : id);

  const filtered = policies.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Policies</h1>
          <p className="text-gray-500 text-sm mt-0.5">Configure leave types and rules for your organization</p>
        </div>
        <button className="flex items-center gap-2 bg-[#00b894] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#00a884] transition-colors">
          <Plus size={14} /> Add Policy
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Leave Types", value: policies.length, color: "text-[#00b894]" },
          { label: "Encashable Types", value: policies.filter(p => p.encashable).length, color: "text-amber-500" },
          { label: "With Carry Forward", value: policies.filter(p => p.carryForward > 0).length, color: "text-blue-500" },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
            <p className={`text-3xl font-black ${c.color}`}>{c.value}</p>
            <p className="text-sm text-gray-500 mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leave policies..."
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00b894]" />

      <div className="space-y-3">
        {filtered.map(p => (
          <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => toggle(p.id)}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
                  <BookOpen size={16} className="text-[#00b894]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{p.name}</h3>
                  <p className="text-xs text-gray-400">Accrual: {p.accrual} · Max: {p.maxAccrual} days</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${genderBadge[p.gender]}`}>{p.gender}</span>
                {p.encashable && <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-600">Encashable</span>}
                {p.carryForward > 0 && <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">Carry Forward</span>}
                <div className="flex gap-1">
                  <button className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg" onClick={e => e.stopPropagation()}><Edit2 size={13} /></button>
                  <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg" onClick={e => e.stopPropagation()}><Trash2 size={13} /></button>
                </div>
                {expanded === p.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
              </div>
            </div>

            {expanded === p.id && (
              <div className="px-6 pb-5 border-t border-gray-50">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 mb-4">
                  {[
                    ["Carry Forward", `${p.carryForward} days`],
                    ["Min Service", p.minService],
                    ["Half Day", p.halfDay ? "Allowed" : "Not Allowed"],
                    ["Pro-rated", p.proRated ? "Yes" : "No"],
                  ].map(([k, v]) => (
                    <div key={k} className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400">{k}</p>
                      <p className="text-sm font-semibold text-gray-800 mt-0.5">{v}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield size={14} className="text-blue-500" />
                    <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Policy Rules</p>
                  </div>
                  <ul className="space-y-1.5">
                    {p.rules.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-blue-700">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}