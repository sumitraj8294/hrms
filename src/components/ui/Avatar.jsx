import clsx from 'clsx'
const gradients = ['from-primary to-accent-teal','from-accent-purple to-accent-pink','from-accent-orange to-accent-yellow','from-accent-blue to-primary','from-accent-pink to-accent-orange']
export default function Avatar({ name = '', src, size = 'md', className }) {
  const idx = name.charCodeAt(0) % gradients.length
  const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-11 h-11 text-base', xl: 'w-14 h-14 text-lg' }
  if (src) return <img src={src} alt={name} className={clsx('rounded-full object-cover', sizes[size], className)}/>
  return (
    <div className={clsx('rounded-full bg-gradient-to-br flex items-center justify-center font-700 text-white flex-shrink-0', gradients[idx], sizes[size], className)}>
      {name.charAt(0).toUpperCase()}
    </div>
  )
}
