import { createSlice } from '@reduxjs/toolkit'
const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: { logs: [], loading: false },
  reducers: {
    setLogs:    (state, { payload }) => { state.logs = payload },
    setLoading: (state, { payload }) => { state.loading = payload },
  },
})
export const { setLogs, setLoading } = attendanceSlice.actions
export default attendanceSlice.reducer
