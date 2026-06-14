import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
export default function Dropdown({ trigger, items }) {
  const [open, setOpen] = useState(false)
  const ref = useRef()
  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])
  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-card-hover border border-border z-50 py-1">
          {items.map((item, i) => (
            <button key={i} onClick={() => { item.onClick?.(); setOpen(false) }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-surface-secondary transition-colors">
              {item.icon && <item.icon size={14} className="text-text-muted"/>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
