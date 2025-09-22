import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Dashboard'],
  endpoints: (builder) => ({
    getDashboard: builder.query({
      query: (params = {}) => ({
        url: "/api/dashboard/me",
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