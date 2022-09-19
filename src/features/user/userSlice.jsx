import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload
        },
        logout: (state) => {
            state.user = null
        }
    }
})

export default userSlice.reducer
export const { login, logout } = userSlice.actions