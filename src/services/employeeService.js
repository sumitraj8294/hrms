import api from './api'

export const employeeService = {
  getAll:    (params) => api.get('/employees', { params }),
  getById:   (id)     => api.get(`/employees/${id}`),
  getStats:  ()       => api.get('/employees/stats'),
  create:    (data)   => api.post('/employees', data),
  update:    (id, data) => api.put(`/employees/${id}`, data),
  deactivate:(id)     => api.patch(`/employees/${id}/deactivate`),
}

export const departmentService = {
  getAll:  ()       => api.get('/departments'),
  create:  (data)   => api.post('/departments', data),
  update:  (id, data) => api.put(`/departments/${id}`, data),
  delete:  (id)     => api.delete(`/departments/${id}`),
}

export const designationService = {
  getAll:  (params) => api.get('/designations', { params }),
  create:  (data)   => api.post('/designations', data),
}

export const documentService = {
  getAll:    (params) => api.get('/documents', { params }),
  upload:    (formData) => api.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  verify:    (id)   => api.patch(`/documents/${id}/verify`),
  delete:    (id)   => api.delete(`/documents/${id}`),
  getExpiring:(days)=> api.get('/documents/expiring', { params:{ days } }),
}