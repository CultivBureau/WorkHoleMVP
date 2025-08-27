import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuthToken } from "../../utils/page";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const timerApi = createApi({
  reducerPath: "timerApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const token = getAuthToken();
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    startTimer: builder.mutation({
      query: (body) => ({
        url: "/api/timer/start",
        method: "POST",
        body,
      }),
    }),
    getCurrentTimer: builder.query({
      query: () => ({
        url: "/api/timer/current",
        method: "GET",
      }),
    }),
    completeTimer: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/api/timer/${id}/complete`,
        method: "PUT",
        body,
      }),
    }),
    cancelTimer: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/api/timer/${id}/cancel`,
        method: "PUT",
        body,
      }),
    }),
    getMyTimers: builder.query({
      query: () => ({
        url: "/api/timer/me",
        method: "GET",
      }),
    }),
    getTimerStats: builder.query({
      query: () => ({
        url: "/api/timer/stats",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useStartTimerMutation,
  useGetCurrentTimerQuery,
  useCompleteTimerMutation,
  useCancelTimerMutation,
  useGetMyTimersQuery,
  useGetTimerStatsQuery,
} = timerApi;