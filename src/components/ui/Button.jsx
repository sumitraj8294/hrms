import clsx from 'clsx'
export default function Button({ children, variant = 'primary', size = 'md', className, ...props }) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-semibold rounded-md transition-all duration-150',
        {
          'bg-primary hover:bg-primary-dark text-white shadow-sm hover:shadow-glow': variant === 'primary',
          'bg-accent-purple hover:opacity-90 text-white': variant === 'purple',
          'bg-white border border-border text-text-primary hover:bg-surface-secondary': variant === 'outline',
          'text-primary hover:bg-primary/10': variant === 'ghost',
          'bg-danger text-white hover:opacity-90': variant === 'danger',
          'px-3 py-1.5 text-xs': size === 'sm',
          'px-4 py-2 text-sm': size === 'md',
          'px-5 py-2.5 text-sm': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
