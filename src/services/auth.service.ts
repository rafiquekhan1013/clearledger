import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ServerResponse } from "../types";

interface AuthParams {
  email: string;
  password: string;
  siteName?: string;
  fingerprint?: Record<string, unknown>;
}

interface ForgotParams {
  email?: string;
  password?: string;
  token?: string;
  siteName?: string;
}

export interface SignupParams {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  contactNumber: string;
  refferByCode: string;
  refferBy?: string;
  siteName: string;
  birthday: string;
  address: string;
  fingerprint?: Record<string, unknown>;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_SERVER_URL,
  }),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    userLogin: builder.mutation<
      { Authorization?: string; data?: { clientBa?: { slug?: string } } },
      AuthParams
    >({
      query: ({ email, password, siteName, fingerprint }: AuthParams) => {
        const body: Record<string, unknown> = { email, password };
        if (siteName) body.siteName = siteName;
        if (fingerprint) body.fingerprint = fingerprint;
        return { url: `/auth/login`, method: "POST", body };
      },
      invalidatesTags: ["Auth"],
    }),
    userSignup: builder.mutation<
      { Authorization?: string; data?: { baSlug?: string } },
      SignupParams
    >({
      query: (signupParams: SignupParams) => ({
        url: `/auth/customer/signup`,
        method: "POST",
        body: signupParams,
      }),
      invalidatesTags: ["Auth"],
    }),
    userForgotPassword: builder.mutation<ServerResponse<unknown>, ForgotParams>({
      query: ({ email, siteName }: ForgotParams) => {
        const body: Record<string, string> = {};
        if (email) body.email = email;
        if (siteName) body.siteName = siteName;
        return { url: `/auth/forgot_password`, method: "POST", body };
      },
      invalidatesTags: ["Auth"],
      transformResponse: (response: ServerResponse<unknown>) => response,
    }),
    userResetPassword: builder.mutation<ServerResponse<unknown>, ForgotParams>({
      query: ({ token, password }: ForgotParams) => ({
        url: `/auth/reset_password`,
        method: "POST",
        body: { token, password },
      }),
      invalidatesTags: ["Auth"],
      transformResponse: (response: ServerResponse<unknown>) => response,
    }),
  }),
});

export const {
  useUserLoginMutation,
  useUserSignupMutation,
  useUserForgotPasswordMutation,
  useUserResetPasswordMutation,
} = authApi;
