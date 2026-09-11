import { api } from "./api";
import type {
  ApiResponse,
  User,
  LoginFormData,
  SignupFormData,
} from "../../types";

export interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<AuthResponse>, LoginFormData>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation<ApiResponse<AuthResponse>, SignupFormData>({
      query: (userFormData) => ({
        url: "/auth/register",
        method: "POST",
        body: userFormData,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useRegisterMutation } = authApi;
