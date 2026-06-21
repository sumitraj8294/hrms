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

export const hrConfigService = {
  // Employment Types
  getEmploymentTypes: ()       => api.get('/hr-config/employment-types'),
  createEmploymentType: (data) => api.post('/hr-config/employment-types', data),
  updateEmploymentType: (id,data) => api.put(`/hr-config/employment-types/${id}`, data),
  toggleEmploymentType: (id)   => api.patch(`/hr-config/employment-types/${id}/toggle`),
  deleteEmploymentType: (id)   => api.delete(`/hr-config/employment-types/${id}`),

  // Shifts
  getShifts: ()       => api.get('/hr-config/shifts'),
  createShift: (data) => api.post('/hr-config/shifts', data),
  updateShift: (id,data) => api.put(`/hr-config/shifts/${id}`, data),
  toggleShift: (id)   => api.patch(`/hr-config/shifts/${id}/toggle`),
  deleteShift: (id)   => api.delete(`/hr-config/shifts/${id}`),

  // Grades
  getGrades: ()       => api.get('/hr-config/grades'),
  createGrade: (data) => api.post('/hr-config/grades', data),
  updateGrade: (id,data) => api.put(`/hr-config/grades/${id}`, data),
  deleteGrade: (id)   => api.delete(`/hr-config/grades/${id}`),

  // Policies
  getPolicies: ()       => api.get('/hr-config/policies'),
  createPolicy: (data)  => api.post('/hr-config/policies', data),
  updatePolicy: (id,data) => api.put(`/hr-config/policies/${id}`, data),
  deletePolicy: (id)    => api.delete(`/hr-config/policies/${id}`),
}