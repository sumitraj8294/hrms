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

export default function Topbar() {
  const { user, logout } = useAuth()
  const now = dayjs().format('ddd, DD MMM YYYY')

  const [openMenu, setOpenMenu] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpenMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () =>
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      )
  }, [])

  return (
    <header className="h-14 bg-gradient-to-r from-[#1f2b44] via-[#1b2740] to-[#162033] border-b border-white/10 flex items-center px-5 shadow-sm">

      {/* Left Section */}
      <div className="flex items-center gap-3 min-w-[240px]">
        <span className="text-sm font-bold text-white">
          {user?.company || 'NexHR Workspace'}
        </span>

        <button className="text-slate-300 hover:text-white transition-colors">
          <Settings size={15} />
        </button>
      </div>

      {/* Search */}
      <div className="flex-1 flex justify-center">
        <div className="relative w-[340px]">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search..."
            className="
              w-full
              pl-10
              pr-4
              py-2
              bg-[#111827]/40
              border
              border-white/10
              rounded-md
              text-sm
              text-white
              placeholder:text-slate-400
              focus:outline-none
              focus:border-violet-400
              transition-all
            "
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 ml-auto">

        {/* Date */}
        <div className="hidden md:flex items-center gap-2 text-slate-300 text-xs">
          <Sun size={14} />
          <span>{now}</span>
        </div>

        {/* Notifications */}
        <button className="relative text-slate-300 hover:text-white transition-colors">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full" />
        </button>

        {/* User Menu */}
        <div
          className="relative"
          ref={menuRef}
        >
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-white/10 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-600 flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>

            <span className="hidden sm:block text-sm font-semibold text-white">
              {user?.name}
            </span>

            <ChevronDown
              size={14}
              className={`text-slate-300 transition-transform ${
                openMenu ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openMenu && (
            <div className="absolute right-0 top-12 w-60 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50">

              {/* User Info */}
              <div className="px-4 py-3 border-b bg-slate-50">
                <p className="font-semibold text-slate-900">
                  {user?.name}
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  {user?.email || user?.role}
                </p>
              </div>

              {/* Menu Items */}
              <button className="w-full px-4 py-3 flex items-center gap-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                <User size={16} />
                My Profile
              </button>

              <button className="w-full px-4 py-3 flex items-center gap-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                <Cog size={16} />
                Account Settings
              </button>

              <button className="w-full px-4 py-3 flex items-center gap-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                <KeyRound size={16} />
                Change Password
              </button>

              <div className="border-t">
                <button
                  onClick={logout}
                  className="w-full px-4 py-3 flex items-center gap-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
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