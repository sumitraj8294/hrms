import { useState, useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { getNavForRole } from '@/config/navigation'
import * as Icons from 'lucide-react'

export default function Sidebar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const navItems = getNavForRole(user?.role)

  const [activeMenu, setActiveMenu] = useState(null)

  // Check if a child path is active — exact match only, no startsWith confusion
  const isChildActive = (child) => {
    // Exact match always works
    if (location.pathname === child.path) return true
    // Prefix match ONLY for paths deeper than 2 segments e.g. /core-hr/add, /core-hr/123
    // This prevents /core-hr matching /core-hr/directory etc.
    const segments = child.path.split('/').filter(Boolean)
    if (segments.length >= 2) {
      return location.pathname.startsWith(child.path + '/')
    }
    return false
  }

  // Find which top-level nav item owns the current URL
  const currentTopKey = navItems.find(item => {
    if (location.pathname === item.path) return true
    if (item.children?.length) return item.children.some(c => isChildActive(c))
    if (item.path !== '/') return location.pathname.startsWith(item.path + '/')
    return false
  })?.key

  // Auto-open panel when URL changes (e.g. on page refresh or direct navigation)
  useEffect(() => {
    if (currentTopKey) setActiveMenu(currentTopKey)
  }, [currentTopKey])

  const handleIconClick = (item) => {
    if (item.children?.length) {
      setActiveMenu(prev => prev === item.key ? null : item.key)
    } else {
      navigate(item.path)
      setActiveMenu(null)
    }
  }

  const openMenu     = activeMenu || currentTopKey
  const submenuItems = navItems.find(n => n.key === openMenu)?.children || []

  return (
    <div className="flex h-screen flex-shrink-0">
      {/* ── Icon rail ── */}
      <aside className="flex flex-col w-[110px] bg-gradient-to-b from-[#1f2b44] to-[#162033] border-r border-sidebar-border flex-shrink-0 z-20">
        {/* Logo */}
        <div className="flex items-center justify-center h-12 border-b border-sidebar-border">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent-teal flex items-center justify-center cursor-pointer" onClick={() => navigate('/dashboard')}>
            <span className="text-white font-800 text-sm">N</span>
          </div>
        </div>

        {/* Nav icons */}
        <nav className="flex-1 overflow-y-auto py-2 flex flex-col items-center gap-0.5">
          {navItems.map(item => {
            const Icon = Icons[item.icon] || Icons.Circle
            const isActive = currentTopKey === item.key
            const isOpen   = openMenu === item.key

            return (
              <button
                key={item.key}
                onClick={() => handleIconClick(item)}
                title={item.label}
                className={`relative flex flex-col items-center justify-center w-full py-2.5 px-1 transition-all duration-150 group
                  ${isActive ? 'text-white' : 'text-slate-200 hover:text-white'}`}
              >
                {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full"/>}

                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all
                  ${isActive ? 'bg-[#5B3FD4]' : isOpen ? 'bg-white/10' : 'group-hover:bg-white/10'}`}>
                  <Icon size={17}/>
                </div>
                <span className={`text-[11px] font-bold mt-1 leading-none text-center
                  ${isActive ? 'text-white' : 'text-slate-200'}`}>
                  {item.label.split(' ')[0]}
                </span>
              </button>
            )
          })}
        </nav>

        {/* User */}
        <div className="flex flex-col items-center gap-2 py-3 border-t border-sidebar-border">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-xs font-700 text-white cursor-pointer">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <button onClick={logout} title="Logout" className="text-slate-600 hover:text-red-400 transition-colors">
            <Icons.LogOut size={14}/>
          </button>
        </div>
      </aside>

      {/* ── Submenu panel ── */}
      {submenuItems.length > 0 && openMenu && (
        <div className="flex flex-col w-[220px] bg-gradient-to-b from-[#1f2b44] to-[#162033] border-r border-violet-800 flex-shrink-0 z-10">
          <div className="h-12 flex items-center justify-between px-4 border-b border-violet-800">
            <span className="text-sm font-extrabold text-violet-100 tracking-wide">
              {navItems.find(n => n.key === openMenu)?.label}
            </span>
            <button
              onClick={() => setActiveMenu(null)}
              className="text-violet-300 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
            >
              <Icons.X size={16}/>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-2 px-2">
            {submenuItems.map(child => {
              const active = isChildActive(child)
              return (
                <NavLink
                  key={child.key}
                  to={child.path}
                  className={`flex items-center px-3 py-2.5 rounded-lg text-xs transition-all duration-150 mb-0.5
                    ${active
                      ? 'bg-[#5B3FD4] text-white font-extrabold shadow-md'
                      : 'text-violet-100 hover:text-white hover:bg-white/10 font-bold'}`}
                >
                  {child.label}
                </NavLink>
              )
            })}
          </nav>
        </div>
      )}
    </div>
  )
}