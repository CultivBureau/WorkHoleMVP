import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const breakApi = createApi({
  reducerPath: "breakApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getBreakTypes: builder.query({
      query: () => ({
        url: "/api/break/types",
        method: "GET",
      }),
    }),
    startBreak: builder.mutation({
      query: (breakType) => ({
        url: "/api/break/start",
        method: "POST",
        body: { breakType },
      }),
      invalidatesTags: ["BreakDashboard"],
    }),
    stopBreak: builder.mutation({
      query: () => ({
        url: "/api/break/stop",
        method: "POST",
      }),
      invalidatesTags: ["BreakDashboard"],
    }),
    getBreakDashboard: builder.query({
      query: () => ({
        url: "/api/break/me",
        method: "GET",
      }),
      providesTags: ["BreakDashboard"],
    }),
    getBreakStats: builder.query({
      query: ({ page = 1, limit = 4, sortBy = 'newest', date = '', type = '' } = {}) => ({
        url: `/api/break/stats?page=${page}&limit=${limit}&sortBy=${sortBy}&date=${date}&type=${type}`,
        method: "GET",
      }),
    }),
    getActiveBreaksCount: builder.query({
      query: () => ({
        url: "/api/break/active-count",
        method: "GET",
      }),
    }),
    createBreakType: builder.mutation({
      query: (body) => ({
        url: "/api/break/type",
        method: "POST",
        body,
      }),
      invalidatesTags: ["BreakTypes"],
    }),
    updateBreakType: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/api/break/type/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["BreakTypes"],
    }),
    deleteBreakType: builder.mutation({
      query: (id) => ({
        url: `/api/break/type/${id}`,
        method: "DELETE",
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
  useDeleteBreakTypeMutation,
} = breakApi;
