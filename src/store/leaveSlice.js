import { createSlice } from '@reduxjs/toolkit'
const leaveSlice = createSlice({
  name: 'leave',
  initialState: { applications: [], balance: {}, loading: false },
  reducers: {
    setApplications: (state, { payload }) => { state.applications = payload },
    setBalance:      (state, { payload }) => { state.balance = payload },
    setLoading:      (state, { payload }) => { state.loading = payload },
  },
})
export const { setApplications, setBalance, setLoading } = leaveSlice.actions
export default leaveSlice.reducer
