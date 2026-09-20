import { api } from "./api";

export interface requestPasswordResetData {
  email: string;
}

export interface resetPasswordData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export const passwordApi = api.injectEndpoints({
  endpoints: (builder) => ({
    requestPasswordReset: builder.mutation<void, requestPasswordResetData>({
      query: (data) => ({
        url: "password/reset-password/request",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }),
    }),

    resetPassword: builder.mutation<void, resetPasswordData>({
      query: (data) => ({
        url: "password/reset-password/confirm",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }),
    }),
  }),
});

export const { useRequestPasswordResetMutation, useResetPasswordMutation } =
  passwordApi;
