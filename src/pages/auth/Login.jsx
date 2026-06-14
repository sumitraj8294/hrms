// src/pages/Login.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Zap, ShieldCheck, UserCog, Users, User } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'
import loginImage from '@/assets/login-image.png'

const DEMO_USERS = {
  super_admin: { name: 'Super Admin',  role: 'super_admin', email: 'superadmin@nexhr.com' },
  admin:       { name: 'Raj Mehta',    role: 'admin',       email: 'admin@nexhr.com' },
  hr:          { name: 'Priya Sharma', role: 'hr',          email: 'hr@nexhr.com' },
  employee:    { name: 'Arjun Singh',  role: 'employee',    email: 'arjun@nexhr.com' },
}

const TABS = [
  { key: 'super_admin', label: 'Super Admin', icon: ShieldCheck, color: 'from-violet-500 to-purple-600', ring: 'ring-violet-300' },
  { key: 'admin',       label: 'Admin',       icon: UserCog,     color: 'from-blue-500 to-cyan-500',     ring: 'ring-blue-300' },
  { key: 'hr',          label: 'HR',          icon: Users,       color: 'from-emerald-500 to-teal-500',  ring: 'ring-emerald-300' },
  { key: 'employee',    label: 'Employee',    icon: User,        color: 'from-pink-500 to-rose-500',     ring: 'ring-pink-300' },
]

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState('hr')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [remember, setRemember] = useState(true)
  const [form, setForm] = useState({ email: '', password: '' })

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    login(DEMO_USERS[role], 'demo_token_' + role)
    toast.success(`Welcome back, ${DEMO_USERS[role].name}!`)
    navigate('/dashboard')
    setLoading(false)
  }

  const activeTab = TABS.find(t => t.key === role)

  return (
    <div className="min-h-screen flex bg-slate-100">

      {/* Left Image Section */}
      <div className="hidden lg:block lg:w-[55%] relative overflow-hidden">
        <img src={loginImage} alt="NexHR" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1f2b44]/90 via-[#1f2b44]/70 to-transparent" />

        <div className="absolute bottom-12 left-12 max-w-xl text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="font-extrabold text-2xl">N</span>
            </div>
            <div>
              <h2 className="text-2xl font-extrabold">NexHR</h2>
              <p className="text-slate-300 text-sm">Enterprise HR Management Platform</p>
            </div>
          </div>

          <h1 className="text-5xl font-extrabold leading-tight mb-5">
            Manage People.<br />Drive Growth.
          </h1>

          <p className="text-lg text-slate-200 leading-relaxed mb-10">
            One unified platform for HR, Attendance, Payroll, Recruitment,
            Performance and Employee Experience.
          </p>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-3xl font-extrabold">10K+</p>
              <p className="text-slate-300 text-sm">Employees</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold">99.9%</p>
              <p className="text-slate-300 text-sm">Uptime</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold">16+</p>
              <p className="text-slate-300 text-sm">Modules</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Login Section */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-[#1f2b44] via-[#1b2740] to-[#162033] p-4 sm:p-8 relative overflow-hidden">

        {/* Decorative blurred accents */}
        <div className={`absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br ${activeTab.color} opacity-20 blur-3xl transition-colors duration-500`} />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-[#00b894]/10 blur-3xl" />

        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 relative z-10">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1f2b44] to-[#324a70] flex items-center justify-center shrink-0">
              <span className="text-white text-xl font-extrabold">N</span>
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-[#1f2b44]">NexHR</h2>
              <p className="text-sm text-slate-500">Enterprise HRMS</p>
            </div>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
            Welcome Back
          </h3>
          <p className="text-slate-500 mb-6 sm:mb-8">
            Sign in to continue to your workspace
          </p>

          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            {TABS.map(tab => {
              const Icon = tab.icon
              const active = role === tab.key
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setRole(tab.key)}
                  className={`
                    flex items-center justify-center gap-2
                    py-2.5 px-2 rounded-xl text-sm font-bold
                    transition-all duration-200
                    ${active
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-md scale-[1.02]`
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }
                  `}
                >
                  <Icon size={16} />
                  <span className="truncate">{tab.label}</span>
                </button>
              )
            })}
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder={DEMO_USERS[role].email}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-sm font-medium
                    focus:outline-none focus:ring-2 focus:ring-[#00b894]/30 focus:border-[#00b894]
                    transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-slate-700">Password</label>
                <a href="/forgot-password" className="text-xs font-semibold text-[#0984e3] hover:underline">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-11 pr-12 py-3 border border-slate-200 rounded-xl text-sm font-medium
                    focus:outline-none focus:ring-2 focus:ring-[#00b894]/30 focus:border-[#00b894]
                    transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#00b894] focus:ring-[#00b894]/30"
              />
              <span className="text-sm text-slate-600 font-medium">Remember me on this device</span>
            </label>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#1f2b44] to-[#324a70]
                hover:from-[#162033] hover:to-[#1f2b44]
                text-white font-bold transition-all shadow-lg
                flex items-center justify-center gap-2
                disabled:opacity-70 active:scale-[0.99]"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Zap size={18} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 justify-center">
            <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${activeTab.color}`} />
            <p className="text-xs text-center text-slate-500">
              Demo Mode — Signing in as <span className="font-semibold text-slate-700">{activeTab.label}</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}