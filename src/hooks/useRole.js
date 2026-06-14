import { useAuth } from '@/context/AuthContext'
import { hasPermission } from '@/config/permissions'
export default function useRole() {
  const { user } = useAuth()
  return {
    role: user?.role,
    can: (permission) => hasPermission(user?.role, permission),
  }
}
