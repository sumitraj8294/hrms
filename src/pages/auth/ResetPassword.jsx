import { Lock } from 'lucide-react'
export default function ResetPassword() {
  return (
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8">
      <h3 className="text-xl font-800 text-text-primary mb-6">Reset Password</h3>
      <div className="space-y-4">
        <div className="relative">
          <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"/>
          <input type="password" placeholder="New password" className="w-full pl-9 pr-3 py-2.5 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"/>
        </div>
        <div className="relative">
          <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"/>
          <input type="password" placeholder="Confirm password" className="w-full pl-9 pr-3 py-2.5 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"/>
        </div>
        <button className="w-full py-2.5 rounded-md text-sm font-700 text-white bg-gradient-to-r from-primary to-accent-teal">Set New Password</button>
      </div>
    </div>
  )
}
