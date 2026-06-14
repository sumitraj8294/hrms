import { Mail, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
export default function ForgotPassword() {
  return (
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent-teal flex items-center justify-center mb-6">
        <span className="text-white font-800 text-lg">N</span>
      </div>
      <h3 className="text-xl font-800 text-text-primary mb-1">Forgot password?</h3>
      <p className="text-sm text-text-secondary mb-6">Enter your email and we'll send a reset link.</p>
      <div className="relative mb-4">
        <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"/>
        <input type="email" placeholder="you@company.com" className="w-full pl-9 pr-3 py-2.5 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"/>
      </div>
      <button className="w-full py-2.5 rounded-md text-sm font-700 text-white bg-gradient-to-r from-primary to-accent-teal mb-4">Send Reset Link</button>
      <Link to="/login" className="flex items-center justify-center gap-1.5 text-sm text-text-secondary hover:text-primary transition-colors">
        <ArrowLeft size={14}/> Back to login
      </Link>
    </div>
  )
}
