import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Provider } from "../types";

interface GetSingleProviderParams {
  slug: string;
  type?: string | boolean;
  state?: string | boolean;
}

interface GetProviderListParams {
  slug?: string;
}

export const providersApi = createApi({
  reducerPath: "providersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_SERVER_URL,
  }),
  endpoints: (builder) => ({
    getProvidersList: builder.query<{ data?: { slug: string; baReferralCode?: string }[] }, GetProviderListParams>({
      query: ({ slug }) => ({
        url: `providers?slug=${slug}`,
      }),
    }),
    getProviderSingle: builder.query<Provider, GetSingleProviderParams>({
      query: ({
        slug,
        type = false,
        state = false,
      }: GetSingleProviderParams) => ({
        url: `providers/single/${slug}`,
        method: "POST",
        body: { state, type },
      }),
    }),
  }),
});

export const { useGetProvidersListQuery, useGetProviderSingleQuery } =
  providersApi;
