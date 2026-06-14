import clsx from 'clsx'
export default function Input({ label, error, icon: Icon, className, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-600 text-text-primary">{label}</label>}
      <div className="relative">
        {Icon && <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"/>}
        <input
          className={clsx(
            'w-full border border-border rounded-md py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-white',
            Icon ? 'pl-9 pr-3' : 'px-3',
            error && 'border-danger focus:ring-danger/30',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}
