export const isEmail  = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
export const isPhone  = (v) => /^[6-9]\d{9}$/.test(v)
export const required = (v) => (v && String(v).trim() !== '') || 'This field is required'
