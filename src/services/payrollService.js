import api from './api'
export const payrollService = {
  getPayslips:    (params) => api.get('/payroll/payslips', { params }),
  runPayroll:     (data)   => api.post('/payroll/run', data),
  getSalaryStruct:(id)     => api.get(`/payroll/structure/${id}`),
}
