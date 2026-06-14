import api from './api'
export const leaveService = {
  getBalance:   ()       => api.get('/leave/balance'),
  apply:        (data)   => api.post('/leave/apply', data),
  getApprovals: ()       => api.get('/leave/approvals'),
  approve:      (id)     => api.put(`/leave/${id}/approve`),
  reject:       (id)     => api.put(`/leave/${id}/reject`),
}
