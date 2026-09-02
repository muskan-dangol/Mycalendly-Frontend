import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import type { User } from "../../types";

const userToken = localStorage.getItem("userToken")
  ? localStorage.getItem("userToken")
  : null;

type AuthState = {
  user: User | null;
  token: string | null;
};

const initialState: AuthState = {
  user: null,
  token: userToken,
} as AuthState;

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
