import { CheckCircle2, XCircle, Clock } from 'lucide-react'
import { useState } from 'react'

const INITIAL = [
  { id:1, name:'Priya Sharma',  type:'Casual Leave',    detail:'Jun 10 – Jun 11 · 2 days',    category:'leave',     urgency:'normal', img:'https://i.pravatar.cc/150?img=47' },
  { id:2, name:'Rahul Verma',   type:'Work From Home',  detail:'Jun 13 – Jun 15 · 3 days',    category:'wfh',       urgency:'high',   img:'https://i.pravatar.cc/150?img=14' },
  { id:3, name:'Anita Roy',     type:'Expense Claim',   detail:'₹3,200 · Travel reimbursement',category:'expense',  urgency:'normal', img:'https://i.pravatar.cc/150?img=31' },
  { id:4, name:'Siddharth K.',  type:'Regularization',  detail:'Jun 8 · Late clock-in',        category:'attendance',urgency:'low',   img:'https://i.pravatar.cc/150?img=53' },
  { id:5, name:'Kavya Nair',    type:'Overtime Request', detail:'Jun 9 · 3 extra hours',       category:'attendance',urgency:'normal', img:'https://i.pravatar.cc/150?img=44' },
]

const CATEGORY_COLORS = {
  leave:      'bg-amber-100 text-amber-700',
  wfh:        'bg-blue-100 text-blue-700',
  expense:    'bg-violet-100 text-violet-700',
  attendance: 'bg-pink-100 text-pink-700',
}

const URGENCY = {
  high:   'bg-red-50 border-l-2 border-red-400',
  normal: '',
  low:    '',
}

export default function PendingApprovals() {
  const [items, setItems] = useState(INITIAL)

  const approve = (id) => setItems(i => i.filter(x => x.id !== id))
  const reject  = (id) => setItems(i => i.filter(x => x.id !== id))

  return (
    <div className="bg-white border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <p className="text-sm font-600 text-text-primary">Pending Approvals</p>
          <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-700 flex items-center justify-center">{items.length}</span>
        </div>
        <button className="text-xs font-600 text-primary hover:underline">View All</button>
      </div>

      <div className="space-y-1.5">
        {items.length === 0 ? (
          <div className="flex flex-col items-center py-6 text-text-muted">
            <CheckCircle2 size={28} className="text-emerald-400 mb-2"/>
            <p className="text-xs">All caught up! No pending approvals.</p>
          </div>
        ) : items.map(item => (
          <div key={item.id} className={`flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors ${URGENCY[item.urgency]}`}>
            <img
              src={item.img}
              alt={item.name}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-slate-200"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-xs font-600 text-text-primary truncate">{item.name}</p>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-700 flex-shrink-0 ${CATEGORY_COLORS[item.category]}`}>
                  {item.type}
                </span>
              </div>
              <p className="text-[10px] text-text-muted">{item.detail}</p>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <button onClick={() => approve(item.id)} className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-colors" title="Approve">
                <CheckCircle2 size={13}/>
              </button>
              <button onClick={() => reject(item.id)} className="w-6 h-6 rounded-md bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors" title="Reject">
                <XCircle size={13}/>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}