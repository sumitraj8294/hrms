import { useState } from 'react'
import { ArrowLeft, ChevronDown, ChevronRight, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Avatar from '@/components/ui/Avatar'

const ORG = {
  name:'Raj Mehta', role:'CEO', dept:'Executive', children:[
    { name:'Neha Kapoor', role:'VP Engineering', dept:'Engineering', children:[
      { name:'Priya Sharma', role:'Tech Lead', dept:'Engineering', children:[
        { name:'Rahul Verma',   role:'Sr. Developer', dept:'Engineering', children:[] },
        { name:'Siddharth K.',  role:'Backend Dev',   dept:'Engineering', children:[] },
      ]},
    ]},
    { name:'Pooja Iyer', role:'VP Sales', dept:'Sales', children:[
      { name:'Arjun Singh', role:'Sales Lead', dept:'Sales', children:[
        { name:'Kavya Nair',  role:'Sales Exec', dept:'Sales', children:[] },
        { name:'Anita Roy',   role:'Sales Exec', dept:'Sales', children:[] },
      ]},
    ]},
    { name:'Ravi Kumar', role:'VP HR', dept:'HR', children:[
      { name:'Divya S.', role:'HR Manager', dept:'HR', children:[] },
    ]},
  ],
}

const DEPT_COLORS = {
  Executive:'from-violet-500 to-purple-600',
  Engineering:'from-blue-500 to-cyan-500',
  Sales:'from-emerald-500 to-teal-500',
  HR:'from-pink-500 to-rose-500',
}

function OrgNode({ node, level=0 }) {
  const [open, setOpen] = useState(level < 2)
  const hasChildren = node.children?.length > 0
  const gradient = DEPT_COLORS[node.dept] || 'from-slate-400 to-slate-500'

  return (
    <div className="flex flex-col items-center">
      <div className={`relative flex flex-col items-center px-4 py-3 rounded-xl border-2 bg-white min-w-[130px] shadow-sm
        ${level===0 ? 'border-violet-300' : 'border-border'} hover:border-primary/40 transition-colors`}>
        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-sm font-700 mb-1.5`}>
          {node.name.charAt(0)}
        </div>
        <p className="text-xs font-700 text-text-primary whitespace-nowrap">{node.name}</p>
        <p className="text-[9px] text-text-muted mt-0.5 whitespace-nowrap">{node.role}</p>
        {hasChildren && (
          <button onClick={() => setOpen(o => !o)}
            className="absolute -bottom-3 w-5 h-5 bg-white border border-border rounded-full flex items-center justify-center shadow-sm hover:border-primary transition-colors z-10">
            {open ? <ChevronDown size={10}/> : <ChevronRight size={10}/>}
          </button>
        )}
      </div>

      {hasChildren && open && (
        <div className="relative mt-6 flex gap-6">
          <div className="absolute top-0 left-0 right-0 h-px bg-border"/>
          {node.children.map((child, i) => (
            <div key={i} className="relative flex flex-col items-center">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-3 bg-border"/>
              <div className="pt-3">
                <OrgNode node={child} level={level+1}/>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function OrgChart() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-5 pt-4 pb-3 border-b border-border bg-white">
        <button onClick={() => navigate('/core-hr')} className="text-text-muted hover:text-primary transition-colors">
          <ArrowLeft size={18}/>
        </button>
        <div className="flex items-center gap-2">
          <Users size={16} className="text-text-muted"/>
          <h2 className="font-700 text-text-primary">Organisation Chart</h2>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-8 flex justify-center">
        <OrgNode node={ORG}/>
      </div>
    </div>
  )
}