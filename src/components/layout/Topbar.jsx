import { useState, useRef, useEffect } from 'react'
import {
  Bell,
  Search,
  Settings,
  ChevronDown,
  Sun,
  User,
  KeyRound,
  LogOut,
  Cog
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import dayjs from 'dayjs'

const SAMPLE_AVATAR = 'https://i.pravatar.cc/150?img=47'

export default function Topbar() {
  const { user, logout } = useAuth()
  const now = dayjs().format('ddd, DD MMM YYYY')

  const [openMenu, setOpenMenu] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const avatarSrc = user?.avatar || SAMPLE_AVATAR

  return (
    <header
      className="relative h-16 flex items-center px-6 shadow-md flex-shrink-0"
      style={{ background: 'linear-gradient(160deg, #1a1f35 0%, #161b2e 50%, #0f1422 100%)' }}
    >
      {/* Decorative blobs — matches sidebar */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-6 left-1/4 w-40 h-16 rounded-full opacity-10"
          style={{ background: 'radial-gradient(ellipse, #7c3aed 0%, transparent 70%)' }}/>
        <div className="absolute -top-4 right-1/3 w-32 h-12 rounded-full opacity-8"
          style={{ background: 'radial-gradient(ellipse, #00b894 0%, transparent 70%)' }}/>
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(to right, transparent, rgba(124,58,237,0.4) 30%, rgba(0,184,148,0.3) 70%, transparent)' }}/>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/5"/>
      </div>

      {/* Left — company name */}
      <div className="relative flex items-center gap-3 min-w-[240px]">
        <span className="text-base font-black text-white tracking-wide">
          {user?.company || 'NexHR Workspace'}
        </span>
        <button className="text-slate-400 hover:text-white transition-colors">
          <Settings size={16} />
        </button>
      </div>

      {/* Search */}
      <div className="relative flex-1 flex justify-center">
        <div className="relative w-[360px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search employees, modules..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/6 border border-white/10 rounded-xl text-sm font-semibold text-white placeholder:text-slate-500 placeholder:font-normal focus:outline-none focus:border-violet-400/60 focus:bg-white/10 transition-all"
          />
        </div>
      </div>

      {/* Right */}
      <div className="relative flex items-center gap-5 ml-auto">

        {/* Date */}
        <div className="hidden md:flex items-center gap-2 text-slate-300 text-xs font-bold tracking-wide">
          <Sun size={15} className="text-amber-400" />
          <span>{now}</span>
        </div>

        {/* Notifications */}
        <button className="relative text-slate-400 hover:text-white transition-colors p-1">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-pink-500 rounded-full ring-2 ring-[#161b2e]" />
        </button>

        {/* User Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
          >
            <img
              src={avatarSrc}
              alt={user?.name || 'User'}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-white/20"
            />
            <div className="hidden sm:block text-left">
              <p className="text-sm font-black text-white leading-tight">{user?.name}</p>
              <p className="text-[10px] font-bold text-slate-400 capitalize leading-tight mt-0.5">{user?.role?.replace('_', ' ')}</p>
            </div>
            <ChevronDown
              size={14}
              className={`text-slate-400 transition-transform duration-200 ${openMenu ? 'rotate-180' : ''}`}
            />
          </button>

          {openMenu && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-64 rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 bg-white">

              {/* User info header */}
              <div className="px-4 py-4 border-b bg-gradient-to-br from-slate-50 to-white flex items-center gap-3">
                <img
                  src={avatarSrc}
                  alt={user?.name || 'User'}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-violet-100 flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-black text-slate-900 truncate text-sm">{user?.name}</p>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5 truncate">{user?.email || user?.role}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-violet-100 text-violet-600 capitalize">
                    {user?.role?.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Menu items */}
              <div className="py-1">
                {[
                  { icon: User,     label: 'My Profile'       },
                  { icon: Cog,      label: 'Account Settings' },
                  { icon: KeyRound, label: 'Change Password'  },
                ].map(({ icon: Icon, label }) => (
                  <button key={label} className="w-full px-4 py-3 flex items-center gap-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                    <Icon size={16} className="text-slate-400" />
                    {label}
                  </button>
                ))}
              </div>

              <div className="border-t">
                <button
                  onClick={logout}
                  className="w-full px-4 py-3 flex items-center gap-3 text-sm font-black text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}