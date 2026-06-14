import { ROLES } from '@/config/roles'
export const isSuperAdmin = (r) => r === ROLES.SUPER_ADMIN
export const isAdmin      = (r) => [ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(r)
export const isHR         = (r) => [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR].includes(r)
export const isManager    = (r) => r === ROLES.MANAGER
export const isEmployee   = (r) => r === ROLES.EMPLOYEE
