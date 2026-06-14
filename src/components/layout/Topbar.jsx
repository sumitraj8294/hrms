import { Bell, Search, Settings, ChevronDown, Sun } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { ROLE_LABELS } from '@/config/roles'
import dayjs from 'dayjs'

export default function Topbar() {
  const { user } = useAuth()
  const now = dayjs().format('DD MMM YYYY')

  return (
    <header className="h-12 bg-violet-950 border-b border-violet-800 flex items-center px-4 gap-4 flex-shrink-0">
      {/* Company name */}
      <span className="text-sm font-600 text-violet-200 mr-2">
  {user?.company || 'NexHR Workspace'}
</span>
      <Settings
  size={15}
  className="text-violet-400 hover:text-violet-200 cursor-pointer transition-colors"
/>
      {/* Search */}
      <div className="flex-1 max-w-xs relative mx-4">
        <Search
  size={13}
  className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-400"
/>

<input
  type="text"
  placeholder="Search…"
  className="w-full pl-8 pr-3 py-1.5 bg-violet-900 border border-violet-700 rounded-md text-xs text-violet-100 placeholder:text-violet-400 focus:outline-none focus:border-violet-500 transition-all"
/>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {/* Date */}
       <div className="flex items-center gap-1.5 text-violet-300 text-xs">
          <Sun size={13}/>
          <span>{now}</span>
        </div>

        {/* Notifications */}
        <button className="relative text-violet-300 hover:text-violet-100 transition-colors">
          <Bell size={16}/>
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-accent-pink rounded-full"/>
        </button>

        {/* User */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-600 flex items-center justify-center text-xs font-700 text-white">
  {user?.name?.charAt(0) || 'U'}
</div>
          <div className="hidden sm:block">
           <p className="text-xs font-600 text-violet-100 leading-none">
  {user?.name}
</p>
          </div>
         <ChevronDown size={12} className="text-violet-400" />
        </div>
      </div>
    </header>
  )
}