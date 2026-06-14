import { createSlice } from '@reduxjs/toolkit'
const employeeSlice = createSlice({
  name: 'employees',
  initialState: { list: [], loading: false, total: 0 },
  reducers: {
    setEmployees: (state, { payload }) => { state.list = payload.data; state.total = payload.total },
    setLoading:   (state, { payload }) => { state.loading = payload },
  },
})
export const { setEmployees, setLoading } = employeeSlice.actions
export default employeeSlice.reducer
