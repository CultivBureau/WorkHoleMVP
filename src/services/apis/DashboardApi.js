import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuthToken } from "../../utils/page";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api/dashboard`,
    prepareHeaders: (headers) => {
      const token = getAuthToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Dashboard'],
  endpoints: (builder) => ({
    getDashboard: builder.query({
      query: (params = {}) => ({
        url: "me",
        method: "GET",
        params: params,
      }),
      // Cache for 5 minutes, only refetch on window focus if data is stale
      keepUnusedDataFor: 300, // 5 minutes
      refetchOnMountOrArgChange: false, // Don't refetch on mount if data exists
      refetchOnWindowFocus: false, // Don't refetch on window focus
      providesTags: (result, error, arg) => [
        { type: 'Dashboard', id: 'LIST' },
        { type: 'Dashboard', id: `MONTH_${arg?.month || 'current'}` }
      ],
    }),
  }),
});

export const { useGetDashboardQuery } = dashboardApi;