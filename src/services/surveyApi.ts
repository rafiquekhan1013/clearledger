import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { storageService } from "./storage.service";
import type { ServerResponse } from "../types";

interface UpdatePasswordParams {
  new_password: string;
  old_password: string;
}

interface DeviceParams {
  fingerprint?: Record<string, unknown>;
}

interface StudyLogParams {
  canId: number;
  country: "USA" | "Canada";
}

export const surveyApi = createApi({
  reducerPath: "surveyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_SERVER_URL,
    prepareHeaders: (headers) => {
      const token = storageService.getAccessToken();
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Survey", "User"],
  endpoints: (builder) => ({
    getSingleSurvey: builder.query<unknown, number>({
      query: (id) => ({ url: `/user/survey/${id}` }),
    }),
    getUser: builder.query<unknown, void>({
      query: () => ({ url: `/user/me` }),
      providesTags: ["User"],
    }),
    getUserBa: builder.query<unknown, void>({
      query: () => ({ url: `user/customer/ba` }),
      providesTags: ["User"],
    }),
    getUserSurvey: builder.query<unknown, void>({
      query: () => ({ url: `/user/customers/getsurvey` }),
    }),
    saveSurvey: builder.mutation<ServerResponse<unknown>, Record<string, string>>({
      query: (body) => ({ url: `/user/customer/survey`, method: "POST", body }),
      invalidatesTags: ["Survey"],
      transformResponse: (r: ServerResponse<unknown>) => r,
    }),
    updateSurvey: builder.mutation<ServerResponse<unknown>, Record<string, string>>({
      query: (body) => ({ url: `/user/customer/survey/update`, method: "POST", body }),
      invalidatesTags: ["Survey"],
      transformResponse: (r: ServerResponse<unknown>) => r,
    }),
    userUpdatePassword: builder.mutation<ServerResponse<unknown>, UpdatePasswordParams>({
      query: ({ old_password, new_password }: UpdatePasswordParams) => ({
        url: `/user/update/password`,
        method: "PUT",
        body: { old_password, new_password },
      }),
      invalidatesTags: ["User"],
      transformResponse: (response: ServerResponse<unknown>) => response,
    }),
    sendDeviceData: builder.mutation<ServerResponse<unknown>, DeviceParams>({
      query: ({ fingerprint }) => ({
        url: "/user/device/fingerprint",
        method: "POST",
        body: { fingerprint },
      }),
      invalidatesTags: ["User"],
      transformResponse: (response: ServerResponse<unknown>) => response,
    }),
    createStudyLog: builder.mutation<ServerResponse<unknown>, StudyLogParams>({
      query: (body) => ({ url: "/user/customer/study-log", method: "POST", body }),
      transformResponse: (response: ServerResponse<unknown>) => response,
    }),
  }),
});

export const {
  useCreateStudyLogMutation,
  useGetUserBaQuery,
  useGetSingleSurveyQuery,
  useGetUserQuery,
  useGetUserSurveyQuery,
  useSaveSurveyMutation,
  useSendDeviceDataMutation,
  useUpdateSurveyMutation,
  useUserUpdatePasswordMutation,
} = surveyApi;
