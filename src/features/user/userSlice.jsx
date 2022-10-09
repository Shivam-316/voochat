import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoadingUser: true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isLoadingUser = false;
    },
    logout: (state) => {
      state.user = null;
      state.isLoadingUser = false;
    },
  },
});

export default userSlice.reducer;
export const { login, logout } = userSlice.actions;
