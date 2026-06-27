import { useState, useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { getNavForRole } from '@/config/navigation'
import companyLogo from '@/assets/Hrorbit_white.png'
import * as Icons from 'lucide-react'

export default function Sidebar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const navItems = getNavForRole(user?.role)

  const [activeMenu, setActiveMenu] = useState(null)

  const isChildActive = (child) => {
    if (location.pathname === child.path) return true
    const segments = child.path.split('/').filter(Boolean)
    if (segments.length >= 2) return location.pathname.startsWith(child.path + '/')
    return false
  }

  const currentTopKey = navItems.find(item => {
    if (location.pathname === item.path) return true
    if (item.children?.length) return item.children.some(c => isChildActive(c))
    if (item.path !== '/') return location.pathname.startsWith(item.path + '/')
    return false
  })?.key

  useEffect(() => {
    if (currentTopKey && activeMenu !== false) setActiveMenu(currentTopKey)
  }, [currentTopKey])

  useEffect(() => { setActiveMenu(null) }, [currentTopKey])

  const handleIconClick = (item) => {
    if (item.children?.length) {
      setActiveMenu(prev => {
        const openKey = prev === false ? null : (prev || currentTopKey)
        return openKey === item.key ? false : item.key
      })
    } else {
      navigate(item.path)
      setActiveMenu(false)
    }
  }

  const openKey      = activeMenu === false ? null : (activeMenu || currentTopKey)
  const submenuItems = navItems.find(n => n.key === openKey)?.children || []

  return (
    <div className="flex h-screen flex-shrink-0">

      {/* ── Icon rail ── */}
      <aside
        className="relative flex flex-col w-[88px] flex-shrink-0 z-20 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1a1f35 0%, #161b2e 40%, #0f1422 100%)' }}
      >
        {/* Decorative gradient blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }}/>
          <div className="absolute top-1/3 -right-6 w-24 h-24 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #00b894 0%, transparent 70%)' }}/>
          <div className="absolute bottom-1/4 -left-4 w-20 h-20 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }}/>
          <div className="absolute -bottom-6 right-0 w-28 h-28 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }}/>
          <div className="absolute top-0 right-0 w-px h-full"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(124,58,237,0.3) 40%, rgba(124,58,237,0.3) 60%, transparent)' }}/>
        </div>

        {/* Logo */}
        <div className="relative flex items-center justify-center h-16 border-b border-white/5 flex-shrink-0">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center cursor-pointer shadow-xl"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #00b894)' }}
            onClick={() => navigate('/dashboard')}
          >
            <span className="text-white font-black text-xl tracking-tight">N</span>
          </div>
        </div>

        {/* Nav icons */}
        <nav className="relative flex-1 overflow-y-auto py-2 flex flex-col items-center gap-0.5 scrollbar-none">
          {navItems.map(item => {
            const Icon     = Icons[item.icon] || Icons.Circle
            const isActive = currentTopKey === item.key
            const isOpen   = openKey === item.key

            return (
              <button
                key={item.key}
                onClick={() => handleIconClick(item)}
                title={item.label}
                className={`relative flex flex-col items-center justify-center w-full py-3 px-2 transition-all duration-150 group
                  ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'}`}
              >
                {isActive && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r-full"
                    style={{ background: 'linear-gradient(to bottom, #7c3aed, #00b894)' }}
                  />
                )}

                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150
                    ${!isActive && isOpen  ? 'bg-white/10' : ''}
                    ${!isActive && !isOpen ? 'group-hover:bg-white/8' : ''}`}
                  style={isActive ? {
                    background: 'linear-gradient(135deg, rgba(124,58,237,0.8), rgba(0,184,148,0.4))',
                    boxShadow: '0 4px 14px rgba(124,58,237,0.4)',
                  } : {}}
                >
                  <Icon size={19}/>
                </div>

                <span className={`text-[10px] font-black mt-1.5 leading-none tracking-wide
                  ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>
                  {item.label.split(' ')[0]}
                </span>
              </button>
            )
          })}
        </nav>

        {/* Bottom — company logo + logout */}
        <div className="relative flex flex-col items-center gap-3 py-4 border-t border-white/5 flex-shrink-0">
          {/* Company logo circle */}
          <div className="relative group cursor-pointer" title="Company">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-violet-400/50 transition-all shadow-md">
              <img
                src={companyLogo}
                alt="Company Logo"
                className="w-full h-full object-cover"
                onError={e => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextElementSibling.style.display = 'flex'
                }}
              />
              <div
                className="w-full h-full hidden items-center justify-center text-sm font-black text-white"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #00b894)' }}
              >
                {(user?.company?.charAt(0) || 'C').toUpperCase()}
              </div>
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#161b2e]"/>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            title="Logout"
            className="text-slate-600 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-500/10"
          >
            <Icons.LogOut size={13}/>
          </button>
        </div>
      </aside>

      {/* ── Submenu panel ── */}
      {submenuItems.length > 0 && openKey && (
        <div
          className="relative flex flex-col w-[220px] flex-shrink-0 z-10 overflow-hidden"
          style={{ background: 'linear-gradient(160deg, #1e2340 0%, #181d33 50%, #121726 100%)' }}
        >
          {/* Subtle blobs in submenu panel */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }}/>
            <div className="absolute bottom-0 -left-6 w-32 h-32 rounded-full opacity-8"
              style={{ background: 'radial-gradient(circle, #00b894 0%, transparent 70%)' }}/>
            <div className="absolute top-0 right-0 w-px h-full"
              style={{ background: 'linear-gradient(to bottom, transparent, rgba(124,58,237,0.2) 30%, rgba(124,58,237,0.2) 70%, transparent)' }}/>
          </div>

          {/* Panel header */}
          <div className="relative h-16 flex items-center justify-between px-5 border-b border-white/5 flex-shrink-0">
            <span className="text-base font-black text-white tracking-wide">
              {navItems.find(n => n.key === openKey)?.label}
            </span>
            <button
              onClick={() => setActiveMenu(false)}
              className="text-slate-500 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
            >
              <Icons.X size={15}/>
            </button>
          </div>

          {/* Links */}
          <nav className="relative flex-1 overflow-y-auto py-3 px-3 scrollbar-none">
            {submenuItems.map(child => {
              const active = isChildActive(child)
              return (
                <NavLink
                  key={child.key}
                  to={child.path}
                  className={`flex items-center px-4 py-3 rounded-lg text-xs transition-all duration-150 mb-1 font-extrabold tracking-wide
                    ${active ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/8'}`}
                  style={active ? {
                    background: 'linear-gradient(90deg, rgba(124,58,237,0.55) 0%, rgba(124,58,237,0.15) 100%)',
                    boxShadow: 'inset 2px 0 0 #7c3aed',
                  } : {}}
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