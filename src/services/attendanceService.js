import api from './api'
export const attendanceService = {
  getLogs:    (params)   => api.get('/attendance', { params }),
  getToday:   (employee) => api.get('/attendance/today', { params:{ employee } }),
  getStats:   ()         => api.get('/attendance/stats'),
  getWeekly:  ()         => api.get('/attendance/weekly'),
  clockIn:    (data)     => api.post('/attendance/clock-in', data),
  clockOut:   (data)     => api.post('/attendance/clock-out', data),
  regularize: (data)     => api.post('/attendance/regularize', data),
}
export const shiftService = {
  getShifts:         ()       => api.get('/shifts'),
  getAssignments:    (params) => api.get('/shifts/assignments', { params }),
  assignShift:       (data)   => api.post('/shifts/assignments', data),
  deleteAssignment:  (id)     => api.delete(`/shifts/assignments/${id}`),
  getOvertimeRules:  ()       => api.get('/shifts/overtime-rules'),
  createOvertimeRule:(data)   => api.post('/shifts/overtime-rules', data),
  updateOvertimeRule:(id,d)   => api.put(`/shifts/overtime-rules/${id}`, d),
  deleteOvertimeRule:(id)     => api.delete(`/shifts/overtime-rules/${id}`),
}
export const deviceService = {
  getAll: ()       => api.get('/devices'),
  create: (data)   => api.post('/devices', data),
  update: (id,d)   => api.put(`/devices/${id}`, d),
  delete: (id)     => api.delete(`/devices/${id}`),
  sync:   (id)     => api.post(`/devices/${id}/sync`),
}