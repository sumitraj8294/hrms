import { createSlice } from '@reduxjs/toolkit'
const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null },
  reducers: {
    setCredentials: (state, { payload }) => { state.user = payload.user; state.token = payload.token },
    clearCredentials: (state) => { state.user = null; state.token = null },
  },
})
export const { setCredentials, clearCredentials } = authSlice.actions
export default authSlice.reducer
