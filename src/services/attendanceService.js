import api from './api'
export const attendanceService = {
  getLogs:      (params) => api.get('/attendance', { params }),
  clockIn:      ()       => api.post('/attendance/clock-in'),
  clockOut:     ()       => api.post('/attendance/clock-out'),
  regularize:   (data)   => api.post('/attendance/regularize', data),
}
