import { useState } from "react";
import { ChevronLeft, ChevronRight, Star, Building2, Download } from "lucide-react";

const holidays2025 = [
  { date: "2025-01-26", name: "Republic Day", type: "National" },
  { date: "2025-03-14", name: "Holi", type: "National" },
  { date: "2025-04-14", name: "Dr. Ambedkar Jayanti", type: "National" },
  { date: "2025-04-18", name: "Good Friday", type: "National" },
  { date: "2025-05-01", name: "Labour Day", type: "National" },
  { date: "2025-08-15", name: "Independence Day", type: "National" },
  { date: "2025-08-27", name: "Onam", type: "Regional" },
  { date: "2025-10-02", name: "Gandhi Jayanti", type: "National" },
  { date: "2025-10-20", name: "Dussehra", type: "National" },
  { date: "2025-10-24", name: "Company Foundation Day", type: "Company" },
  { date: "2025-11-05", name: "Diwali", type: "National" },
  { date: "2025-11-06", name: "Diwali (Day 2)", type: "Company" },
  { date: "2025-12-25", name: "Christmas", type: "National" },
];

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const typeColor = {
  National: { dot: "bg-blue-500", badge: "bg-blue-100 text-blue-700" },
  Regional: { dot: "bg-violet-500", badge: "bg-violet-100 text-violet-700" },
  Company: { dot: "bg-amber-500", badge: "bg-amber-100 text-amber-700" },
};

function getDaysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDay(y, m) { return new Date(y, m, 1).getDay(); }

export default function HolidayCalendar() {
  const [month, setMonth] = useState(6); // July
  const [year] = useState(2025);
  const [filter, setFilter] = useState("All");

  const days = getDaysInMonth(year, month);
  const firstDay = getFirstDay(year, month);

  const holidayMap = {};
  holidays2025.forEach(h => {
    const d = new Date(h.date);
    if (d.getFullYear() === year && d.getMonth() === month) holidayMap[d.getDate()] = h;
  });

  const upcoming = [...holidays2025]
    .filter(h => {
      const d = new Date(h.date);
      return d >= new Date() && (filter === "All" || h.type === filter);
    })
    .slice(0, 8);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Holiday Calendar</h1>
          <p className="text-gray-500 text-sm mt-0.5">{holidays2025.length} holidays in {year}</p>
        </div>
        <button className="flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
          <Download size={14} /> Download Calendar
        </button>
      </div>

      <div className="flex gap-2">
        {["All","National","Regional","Company"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === f ? "bg-[#00b894] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setMonth(m => Math.max(0, m - 1))} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronLeft size={16} /></button>
            <h2 className="font-bold text-gray-800">{months[month]} {year}</h2>
            <button onClick={() => setMonth(m => Math.min(11, m + 1))} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronRight size={16} /></button>
          </div>
          <div className="grid grid-cols-7 text-center mb-2">
            {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => <div key={d} className="text-xs font-medium text-gray-400 py-1">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array(firstDay).fill(null).map((_, i) => <div key={`e${i}`} />)}
            {Array(days).fill(null).map((_, i) => {
              const day = i + 1;
              const h = holidayMap[day];
              const isWeekend = new Date(year, month, day).getDay() % 6 === 0;
              return (
                <div key={day} className={`relative rounded-xl p-2 text-center text-sm cursor-pointer transition-colors
                  ${h ? "bg-[#00b894] text-white font-semibold" : isWeekend ? "bg-gray-50 text-gray-400" : "hover:bg-gray-50 text-gray-700"}`}
                  title={h ? h.name : ""}>
                  {day}
                  {h && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/70" />}
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-4 pt-4 border-t border-gray-50 text-xs text-gray-400">
            {Object.entries(typeColor).map(([k, v]) => (
              <span key={k} className="flex items-center gap-1.5"><span className={`w-2 h-2 rounded-full ${v.dot}`} />{k}</span>
            ))}
          </div>
        </div>

        {/* Upcoming Holidays */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Upcoming Holidays</h2>
          <div className="space-y-3">
            {upcoming.map((h, i) => {
              const d = new Date(h.date);
              const diffMs = d - new Date();
              const diffDays = Math.ceil(diffMs / 86400000);
              return (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex flex-col items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-gray-800">{months[d.getMonth()].slice(0,3)}</span>
                    <span className="text-lg font-black text-[#00b894] leading-none">{d.getDate()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{h.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColor[h.type].badge}`}>{h.type}</span>
                      <span className="text-xs text-gray-400">{diffDays === 0 ? "Today" : diffDays === 1 ? "Tomorrow" : `in ${diffDays} days`}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}