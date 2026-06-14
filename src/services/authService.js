import api from './api'
export const authService = {
  login:   (data)  => api.post('/auth/login', data),
  logout:  ()      => api.post('/auth/logout'),
  me:      ()      => api.get('/auth/me'),
  refresh: ()      => api.post('/auth/refresh'),
}
