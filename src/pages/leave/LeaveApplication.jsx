import { useState } from "react";
import { Calendar, ChevronDown, Upload, CheckCircle, AlertCircle } from "lucide-react";

const leaveTypes = ["Casual Leave", "Sick Leave", "Earned Leave", "Maternity Leave", "Comp Off", "LOP"];

const balances = {
  "Casual Leave": 7, "Sick Leave": 8, "Earned Leave": 9, "Maternity Leave": 180, "Comp Off": 2, "LOP": 0,
};

function diffDays(from, to) {
  if (!from || !to) return 0;
  const d = (new Date(to) - new Date(from)) / 86400000 + 1;
  return d > 0 ? d : 0;
}

export default function LeaveApplication() {
  const [form, setForm] = useState({ type: "", from: "", to: "", reason: "", halfDay: false, session: "first", notify: "" });
  const [submitted, setSubmitted] = useState(false);
  const days = diffDays(form.from, form.to);
  const balance = form.type ? balances[form.type] : null;
  const insufficient = balance !== null && days > balance;

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  if (submitted) return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[400px]">
      <div className="bg-green-50 rounded-full p-6 mb-4"><CheckCircle size={48} className="text-[#00b894]" /></div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">Application Submitted!</h2>
      <p className="text-gray-500 mb-6 text-center">Your leave request has been sent for approval. You'll be notified once it's reviewed.</p>
      <button onClick={() => { setSubmitted(false); setForm({ type: "", from: "", to: "", reason: "", halfDay: false, session: "first", notify: "" }); }}
        className="bg-[#00b894] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#00a884] transition-colors">
        Apply Another Leave
      </button>
    </div>
  );

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Apply for Leave</h1>
        <p className="text-gray-500 text-sm mt-0.5">Fill in the details to submit your leave request</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        {/* Leave Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Leave Type <span className="text-red-500">*</span></label>
          <div className="relative">
            <select value={form.type} onChange={e => set("type", e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#00b894] bg-white">
              <option value="">Select leave type</option>
              {leaveTypes.map(t => <option key={t}>{t}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
          </div>
          {form.type && <p className="text-xs text-gray-400 mt-1">Available balance: <span className="font-semibold text-[#00b894]">{balances[form.type]} days</span></p>}
        </div>

        {/* Half Day */}
        <div className="flex items-center gap-3">
          <input type="checkbox" id="halfDay" checked={form.halfDay} onChange={e => set("halfDay", e.target.checked)} className="w-4 h-4 accent-[#00b894]" />
          <label htmlFor="halfDay" className="text-sm text-gray-700">Half Day Leave</label>
          {form.halfDay && (
            <div className="flex gap-2 ml-2">
              {["first", "second"].map(s => (
                <button key={s} onClick={() => set("session", s)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${form.session === s ? "bg-[#00b894] text-white" : "bg-gray-100 text-gray-600"}`}>
                  {s === "first" ? "First Half" : "Second Half"}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">From Date <span className="text-red-500">*</span></label>
            <div className="relative">
              <input type="date" value={form.from} onChange={e => set("from", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00b894]" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">To Date <span className="text-red-500">*</span></label>
            <input type="date" value={form.to} onChange={e => set("to", e.target.value)} min={form.from}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00b894]" />
          </div>
        </div>

        {days > 0 && (
          <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm ${insufficient ? "bg-red-50 text-red-600" : "bg-green-50 text-[#00b894]"}`}>
            {insufficient ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
            {days} day{days > 1 ? "s" : ""} selected{insufficient ? " — Insufficient balance!" : ""}
          </div>
        )}

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason <span className="text-red-500">*</span></label>
          <textarea value={form.reason} onChange={e => set("reason", e.target.value)} rows={3} placeholder="Briefly describe the reason for leave..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00b894] resize-none" />
        </div>

        {/* Attachment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Attachment <span className="text-gray-400 font-normal">(optional)</span></label>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl py-6 cursor-pointer hover:border-[#00b894] hover:bg-green-50 transition-colors">
            <Upload size={20} className="text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">Upload medical certificate or document</span>
            <span className="text-xs text-gray-400 mt-1">PDF, JPG, PNG up to 5MB</span>
            <input type="file" className="hidden" />
          </label>
        </div>

        {/* Notify */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Notify (optional)</label>
          <input type="text" value={form.notify} onChange={e => set("notify", e.target.value)} placeholder="Add team members to notify..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00b894]" />
        </div>

        <div className="flex gap-3 pt-2">
          <button className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors">Save as Draft</button>
          <button onClick={() => { if (form.type && form.from && form.to && form.reason && !insufficient) setSubmitted(true); }}
            disabled={!form.type || !form.from || !form.to || !form.reason || insufficient}
            className="flex-1 bg-[#00b894] text-white py-2.5 rounded-xl font-medium text-sm hover:bg-[#00a884] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            Submit Application
          </button>
        </div>
      </div>
    </div>
  );
}