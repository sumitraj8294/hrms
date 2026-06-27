import { useState } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import Modal from '@/components/ui/Modal'

const MOCK = [
  { _id:'1', name:'Standard OT',   thresholdHours:8,  multiplier:1.5, applicableTo:'all',  isActive:true  },
  { _id:'2', name:'Weekend OT',    thresholdHours:0,  multiplier:2.0, applicableTo:'all',  isActive:true  },
  { _id:'3', name:'Holiday OT',    thresholdHours:0,  multiplier:2.5, applicableTo:'all',  isActive:false },
]

export default function OvertimeRules() {
  const [rules, setRules]   = useState(MOCK)
  const [modal, setModal]   = useState(false)
  const [edit,  setEdit]    = useState(null)
  const [form,  setForm]    = useState({ name:'', thresholdHours:8, multiplier:1.5, applicableTo:'all' })

  const openAdd  = () => { setEdit(null); setForm({ name:'', thresholdHours:8, multiplier:1.5, applicableTo:'all' }); setModal(true) }
  const openEdit = (r) => { setEdit(r); setForm({ name:r.name, thresholdHours:r.thresholdHours, multiplier:r.multiplier, applicableTo:r.applicableTo }); setModal(true) }
  const handleSave = () => {
    if (!form.name.trim()) return
    if (edit) setRules(r => r.map(x => x._id===edit._id ? {...x,...form} : x))
    else setRules(r => [...r, { ...form, _id:Date.now().toString(), isActive:true }])
    setModal(false)
  }
  const handleDelete = (id) => setRules(r => r.filter(x => x._id !== id))
  const handleToggle = (id) => setRules(r => r.map(x => x._id===id ? {...x,isActive:!x.isActive} : x))

  const GRADS = ['from-violet-500 to-purple-400','from-blue-500 to-cyan-400','from-amber-500 to-yellow-400']

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border bg-white">
        <div><h2 className="font-700 text-text-primary">Overtime Rules</h2><p className="text-xs text-text-muted">Configure overtime thresholds and pay multipliers</p></div>
        <button onClick={openAdd} className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-primary to-emerald-400 text-white rounded-md text-xs font-600 hover:opacity-90"><Plus size={13}/> Add Rule</button>
      </div>
      <div className="flex-1 overflow-y-auto p-5 bg-gradient-to-b from-slate-50/50 to-transparent">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {rules.map((r,i) => {
            const grad = GRADS[i%GRADS.length]
            return (
              <div key={r._id} className="relative bg-white border border-border rounded-xl p-4 overflow-hidden hover:shadow-card-hover hover:-translate-y-0.5 transition-all">
                <div className={`absolute inset-0 bg-gradient-to-br ${grad} opacity-[0.05]`}/>
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${grad}`}/>
                <div className="relative z-10 flex items-start justify-between mb-3">
                  <p className="text-sm font-700 text-text-primary">{r.name}</p>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(r)} className="w-6 h-6 rounded-md hover:bg-slate-100 flex items-center justify-center text-text-muted hover:text-primary transition-colors"><Edit2 size={12}/></button>
                    <button onClick={() => handleDelete(r._id)} className="w-6 h-6 rounded-md hover:bg-red-50 flex items-center justify-center text-text-muted hover:text-red-500 transition-colors"><Trash2 size={12}/></button>
                  </div>
                </div>
                <div className="relative z-10 grid grid-cols-2 gap-2">
                  {[['Threshold',`${r.thresholdHours}h/day`],['Multiplier',`${r.multiplier}x`],['Applicable',r.applicableTo],['Status',r.isActive?'Active':'Inactive']].map(([l,v]) => (
                    <div key={l} className="bg-white/70 rounded-lg p-2 border border-white">
                      <p className="text-[10px] text-text-muted">{l}</p>
                      <p className="text-xs font-700 text-text-primary mt-0.5">{v}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => handleToggle(r._id)}
                  className={`relative z-10 mt-3 w-full text-xs font-600 py-1.5 rounded-lg border transition-colors ${r.isActive?'border-red-200 text-red-500 hover:bg-red-50':'border-emerald-200 text-emerald-600 hover:bg-emerald-50'}`}>
                  {r.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            )
          })}
        </div>
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title={edit ? 'Edit Rule' : 'Add Overtime Rule'} size="sm">
        <div className="space-y-3">
          <div><label className="block text-xs font-600 text-text-primary mb-1.5">Rule Name</label>
            <input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="e.g. Standard Overtime"
              className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"/></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-600 text-text-primary mb-1.5">Threshold (hrs/day)</label>
              <input type="number" value={form.thresholdHours} onChange={e=>setForm(p=>({...p,thresholdHours:+e.target.value}))}
                className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"/></div>
            <div><label className="block text-xs font-600 text-text-primary mb-1.5">Pay Multiplier</label>
              <input type="number" step="0.5" value={form.multiplier} onChange={e=>setForm(p=>({...p,multiplier:+e.target.value}))}
                className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"/></div>
          </div>
          <div><label className="block text-xs font-600 text-text-primary mb-1.5">Applicable To</label>
            <select value={form.applicableTo} onChange={e=>setForm(p=>({...p,applicableTo:e.target.value}))}
              className="w-full px-3 py-2 border border-border rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30">
              {['all','department','employment_type'].map(o=><option key={o} value={o}>{o.replace('_',' ')}</option>)}
            </select></div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setModal(false)} className="px-4 py-2 border border-border rounded-md text-sm font-600 text-text-secondary hover:bg-slate-50">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-md text-sm font-600 hover:bg-primary-dark">Save</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}