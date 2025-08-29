import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuthToken } from "../../utils/page";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const breakApi = createApi({
  reducerPath: "breakApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api/break`,
    prepareHeaders: (headers) => {
      const token = getAuthToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getBreakTypes: builder.query({
      query: () => ({
        url: "types",
        method: "GET",
      }),
    }),
    startBreak: builder.mutation({
      query: (breakType) => ({
        url: "start",
        method: "POST",
        body: { breakType },
      }),
      invalidatesTags: ["BreakDashboard"],
    }),
    stopBreak: builder.mutation({
      query: () => ({
        url: "stop",
        method: "POST",
      }),
      invalidatesTags: ["BreakDashboard"],
    }),
    getBreakDashboard: builder.query({
      query: () => ({
        url: "me",
        method: "GET",
      }),
      providesTags: ["BreakDashboard"],
    }),
    getBreakStats: builder.query({
      query: ({ page = 1, limit = 4, sortBy = 'newest', date = '', type = '' } = {}) => ({
        url: `stats?page=${page}&limit=${limit}&sortBy=${sortBy}&date=${date}&type=${type}`,
        method: "GET",
      }),
    }),
    getActiveBreaksCount: builder.query({
      query: () => ({
        url: "active-count",
        method: "GET",
      }),
    }),
    createBreakType: builder.mutation({
      query: (body) => ({
        url: "type",
        method: "POST",
        body,
      }),
      invalidatesTags: ["BreakTypes"],
    }),
    updateBreakType: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `type/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["BreakTypes"],
    }),
  }),
});

export const {
  useGetBreakTypesQuery,
  useStartBreakMutation,
  useStopBreakMutation,
  useGetBreakDashboardQuery,
  useGetBreakStatsQuery,
  useGetActiveBreaksCountQuery,
  useCreateBreakTypeMutation,
  useUpdateBreakTypeMutation,
} = breakApi;
