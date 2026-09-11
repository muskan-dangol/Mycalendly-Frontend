import { api } from "./api";
import type { ApiResponse } from "../../types";

interface Token {
  token: string;
}

export const emailVerifyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    verifyEmail: builder.mutation<ApiResponse<unknown>, Token>({
      query: ({ token }) => ({
        url: `user/verify-email`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      }),
    }),
  }),
});

export const { useVerifyEmailMutation } = emailVerifyApi;
