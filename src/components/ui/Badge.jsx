import clsx from 'clsx'
const variants = {
  green:  'bg-emerald-50 text-emerald-700 border border-emerald-200',
  red:    'bg-red-50 text-red-700 border border-red-200',
  yellow: 'bg-amber-50 text-amber-700 border border-amber-200',
  blue:   'bg-blue-50 text-blue-700 border border-blue-200',
  purple: 'bg-violet-50 text-violet-700 border border-violet-200',
  gray:   'bg-slate-100 text-slate-600 border border-slate-200',
  pink:   'bg-pink-50 text-pink-700 border border-pink-200',
}
export default function Badge({ children, variant = 'gray', className }) {
  return (
    <span className={clsx('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-600', variants[variant], className)}>
      {children}
    </span>
  )
}
