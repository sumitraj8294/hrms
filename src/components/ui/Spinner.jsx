export default function Spinner({ size = 'md' }) {
  const s = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' }
  return <div className={`${s[size]} border-2 border-primary border-t-transparent rounded-full animate-spin`}/>
}
