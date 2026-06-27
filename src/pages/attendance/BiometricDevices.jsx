import { useState } from 'react'
import { Plus, Edit2, Trash2, RefreshCw, Wifi, WifiOff } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import Badge from '@/components/ui/Badge'

const MOCK = [
  { _id:'1', name:'Main Entrance',    deviceId:'BIO-001', location:'Ground Floor Lobby', ipAddress:'192.168.1.50', status:'online',  lastSync:'2024-05-14 09:01' },
  { _id:'2', name:'Server Room',      deviceId:'BIO-002', location:'3rd Floor, IT Wing', ipAddress:'192.168.1.51', status:'offline', lastSync:'2024-05-13 18:30' },
  { _id:'3', name:'Cafeteria Entry',  deviceId:'BIO-003', location:'Basement Level',     ipAddress:'192.168.1.52', status:'online',  lastSync:'2024-05-14 08:55' },
]

const STATUS_ICON    = { online:<Wifi size={14} className="text-emerald-500"/>, offline:<WifiOff size={14} className="text-slate-400"/> }
const STATUS_VARIANT = { online:'green', offline:'gray' }
const GRADS = ['from-blue-500 to-cyan-400','from-violet-500 to-purple-400','from-emerald-500 to-teal-400']
const EMPTY = { name:'', deviceId:'', location:'', ipAddress:'' }

export default function BiometricDevices() {
  const [devices,  setDevices]  = useState(MOCK)
  const [modal,    setModal]    = useState(false)
  const [edit,     setEdit]     = useState(null)
  const [form,     setForm]     = useState(EMPTY)
  const [delTarget,setDel]      = useState(null)

  const openAdd  = () => { setEdit(null); setForm(EMPTY); setModal(true) }
  const openEdit = (d) => { setEdit(d); setForm({ name:d.name, deviceId:d.deviceId, location:d.location, ipAddress:d.ipAddress }); setModal(true) }
  const handleSave = () => {
    if (!form.name.trim()||!form.deviceId.trim()) return
    if (edit) setDevices(d => d.map(x => x._id===edit._id ? {...x,...form} : x))
    else setDevices(d => [...d, { ...form, _id:Date.now().toString(), status:'offline', lastSync:'Never' }])
    setModal(false)
  }
  const handleDelete = () => { setDevices(d => d.filter(x => x._id!==delTarget._id)); setDel(null) }
  const handleSync   = (id) => setDevices(d => d.map(x => x._id===id ? {...x,status:'online',lastSync:new Date().toLocaleString()} : x))

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border bg-white">
        <div><h2 className="font-700 text-text-primary">Biometric Devices</h2><p className="text-xs text-text-muted">Manage fingerprint / face recognition devices</p></div>
        <button onClick={openAdd} className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-primary to-emerald-400 text-white rounded-md text-xs font-600 hover:opacity-90"><Plus size={13}/> Add Device</button>
      </div>
      <div className="flex-1 overflow-y-auto p-5 bg-gradient-to-b from-slate-50/50 to-transparent">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {devices.map((d,i) => {
            const grad = GRADS[i%GRADS.length]
            return (
              <div key={d._id} className="relative bg-white border border-border rounded-xl p-4 overflow-hidden hover:shadow-card-hover hover:-translate-y-0.5 transition-all">
                <div className={`absolute inset-0 bg-gradient-to-br ${grad} opacity-[0.05]`}/>
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${grad}`}/>
                <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${grad} opacity-10 blur-2xl`}/>
                <div className="relative z-10 flex items-start justify-between mb-3">
                  <div><p className="text-sm font-700 text-text-primary">{d.name}</p><p className="text-[10px] text-text-muted">ID: {d.deviceId}</p></div>
                  <div className="flex items-center gap-1">{STATUS_ICON[d.status]}<Badge variant={STATUS_VARIANT[d.status]}>{d.status}</Badge></div>
                </div>
                <div className="relative z-10 space-y-1.5 mb-3">
                  {[['Location',d.location],['IP Address',d.ipAddress],['Last Sync',d.lastSync]].map(([l,v]) => (
                    <div key={l} className="flex justify-between text-xs">
                      <span className="text-text-muted">{l}</span><span className="font-600 text-text-primary">{v||'—'}</span>
                    </div>
                  ))}
                </div>
                <div className="relative z-10 flex gap-1.5 pt-3 border-t border-white/60">
                  <button onClick={() => handleSync(d._id)} className="flex-1 text-xs font-600 text-primary border border-primary/30 rounded-md py-1.5 hover:bg-primary/5 transition-colors flex items-center justify-center gap-1">
                    <RefreshCw size={11}/> Sync
                  </button>
                  <button onClick={() => openEdit(d)} className="w-7 h-7 rounded-md hover:bg-slate-100 flex items-center justify-center text-text-muted hover:text-primary"><Edit2 size={12}/></button>
                  <button onClick={() => setDel(d)} className="w-7 h-7 rounded-md hover:bg-red-50 flex items-center justify-center text-text-muted hover:text-red-500"><Trash2 size={12}/></button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title={edit?'Edit Device':'Add Device'} size="sm">
        <div className="space-y-3">
          {[{label:'Device Name',name:'name',placeholder:'e.g. Main Entrance'},{label:'Device ID',name:'deviceId',placeholder:'e.g. BIO-001'},{label:'Location',name:'location',placeholder:'e.g. Ground Floor Lobby'},{label:'IP Address',name:'ipAddress',placeholder:'192.168.1.50'}].map(f => (
            <div key={f.name}>
              <label className="block text-xs font-600 text-text-primary mb-1.5">{f.label}{['name','deviceId'].includes(f.name)&&<span className="text-red-500 ml-0.5">*</span>}</label>
              <input name={f.name} value={form[f.name]} onChange={e=>setForm(p=>({...p,[e.target.name]:e.target.value}))} placeholder={f.placeholder}
                className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"/>
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setModal(false)} className="px-4 py-2 border border-border rounded-md text-sm font-600 text-text-secondary hover:bg-slate-50">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-md text-sm font-600 hover:bg-primary-dark">{edit?'Update':'Save'}</button>
          </div>
        </div>
      </Modal>
      <Modal open={!!delTarget} onClose={() => setDel(null)} title="Remove Device" size="sm">
        <p className="text-sm text-text-secondary mb-4">Remove <strong>{delTarget?.name}</strong>?</p>
        <div className="flex justify-end gap-2">
          <button onClick={() => setDel(null)} className="px-4 py-2 border border-border rounded-md text-sm font-600 text-text-secondary hover:bg-slate-50">Cancel</button>
          <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-md text-sm font-600 hover:bg-red-600">Remove</button>
        </div>
      </Modal>
    </div>
  )
}