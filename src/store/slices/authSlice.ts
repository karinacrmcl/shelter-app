import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "../api/authApi";

export interface LoginState {
  currentUser: boolean;
}

const initialState: LoginState = {
  currentUser: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = false;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.signin.matchFulfilled, (state) => {
      state.currentUser = true;
    });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
