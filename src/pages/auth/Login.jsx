import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Zap } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

const DEMO_USERS = {
  super_admin: { name: 'Super Admin',  role: 'super_admin', email: 'superadmin@nexhr.com' },
  admin:       { name: 'Raj Mehta',    role: 'admin',       email: 'admin@nexhr.com' },
  hr:          { name: 'Priya Sharma', role: 'hr',          email: 'hr@nexhr.com' },
  employee:    { name: 'Arjun Singh',  role: 'employee',    email: 'arjun@nexhr.com' },
}

const TABS = [
  { key: 'super_admin', label: 'Super Admin', color: 'from-violet-500 to-purple-600' },
  { key: 'admin',       label: 'Admin',       color: 'from-blue-500 to-cyan-500' },
  { key: 'hr',          label: 'HR',          color: 'from-emerald-500 to-teal-500' },
  { key: 'employee',    label: 'Employee',    color: 'from-pink-500 to-rose-500' },
]

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [role, setRole]       = useState('hr')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
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
    <div className="w-full max-w-4xl flex rounded-2xl overflow-hidden shadow-2xl">
      {/* Left Panel */}
      <div className="hidden md:flex flex-col w-[420px] bg-gradient-to-br from-[#0f1117] to-[#1a1d27] p-10 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"/>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-accent-purple/20 rounded-full blur-3xl"/>

        {/* Logo */}
        <div className="flex items-center gap-3 mb-12 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent-teal flex items-center justify-center">
            <span className="text-white font-800 text-lg">N</span>
          </div>
          <div>
            <p className="text-white font-800 text-xl leading-none">NexHR</p>
            <p className="text-slate-400 text-xs mt-0.5">Enterprise HRMS</p>
          </div>
        </div>

        <div className="relative z-10 flex-1">
          <h2 className="text-white font-800 text-3xl leading-tight mb-3">
            People-first HR,<br/>built for scale
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Manage your entire workforce lifecycle from one unified, intelligent platform.
          </p>

          {/* Feature chips */}
          <div className="flex flex-wrap gap-2 mb-10">
            {['Payroll','Attendance','Recruitment','Performance','LMS','Analytics','Onboarding','Helpdesk'].map(f => (
              <span key={f} className="px-3 py-1 rounded-full text-xs font-600 bg-white/10 text-slate-300 border border-white/10">
                {f}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[['16+','Modules'],['99.9%','Uptime'],['10k+','Employees']].map(([v,l]) => (
              <div key={l} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <p className="text-white font-800 text-lg leading-none">{v}</p>
                <p className="text-slate-400 text-xs mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-slate-600 text-xs relative z-10 mt-6">© 2026 NexHR. All rights reserved.</p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 bg-white p-8 flex flex-col justify-center">
        <div className="max-w-sm mx-auto w-full">
          <h3 className="text-xl font-800 text-text-primary mb-1">Welcome back</h3>
          <p className="text-sm text-text-secondary mb-6">Sign in to your workspace</p>

          {/* Role tabs */}
          <div className="flex gap-1.5 bg-surface-secondary rounded-lg p-1 mb-6">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setRole(tab.key)}
                className={`flex-1 py-1.5 text-xs font-600 rounded-md transition-all duration-150
                  ${role === tab.key
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-sm`
                    : 'text-text-muted hover:text-text-primary'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-xs font-600 text-text-primary block mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"/>
                <input
                  type="email"
                  placeholder={DEMO_USERS[role].email}
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full pl-9 pr-3 py-2.5 border border-border rounded-md text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-600 text-text-primary">Password</label>
                <a href="/forgot-password" className="text-xs text-accent-blue hover:underline font-500">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"/>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  className="w-full pl-9 pr-10 py-2.5 border border-border rounded-md text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors">
                  {showPass ? <EyeOff size={15}/> : <Eye size={15}/>}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 rounded-md text-sm font-700 text-white transition-all duration-150
                bg-gradient-to-r ${activeTab.color} hover:opacity-90 shadow-sm
                disabled:opacity-60 flex items-center justify-center gap-2`}
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
              ) : (
                <><Zap size={15}/> Sign In to NexHR</>
              )}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-5 p-3 bg-surface-secondary rounded-lg border border-border">
            <p className="text-xs text-text-muted text-center">
              <span className="font-600 text-text-secondary">Demo mode</span> — select a role tab and click Sign In
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
