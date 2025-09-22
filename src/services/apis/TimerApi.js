import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const timerApi = createApi({
  reducerPath: "timerApi",
  baseQuery: baseQueryWithReauth,
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
      // Reduce polling frequency and add better caching
      keepUnusedDataFor: 30, // Keep data for 30 seconds
      refetchOnMountOrArgChange: false, // Don't refetch on mount if data exists
      refetchOnWindowFocus: false, // Don't refetch on window focus
    }),
    pauseTimer: builder.mutation({
      query: (id) => ({
        url: `/api/timer/${id}/pause`,
        method: "PUT",
      }),
    }),
    resumeTimer: builder.mutation({
      query: (id) => ({
        url: `/api/timer/${id}/resume`,
        method: "PUT",
      }),
    }),
    completeTimer: builder.mutation({
      query: ({ id, note }) => ({
        url: `/api/timer/${id}/complete`,
        method: "PUT",
        body: { 
          status: 'completed',
          note: note || '' 
        },
      }),
    }),
    cancelTimer: builder.mutation({
      query: ({ id, note }) => ({
        url: `/api/timer/${id}/cancel`,
        method: "PUT",
        body: { 
          status: 'cancelled',
          note: note || '' 
        },
      }),
    }),
    getTimerLogs: builder.query({
      query: () => ({
        url: "/api/timer/logs",
        method: "GET",
      }),
      // Add caching for timer logs
      keepUnusedDataFor: 60, // Keep data for 1 minute
      refetchOnMountOrArgChange: false,
      refetchOnWindowFocus: false,
    }),
    getWeeklyFocusTime: builder.query({
      query: () => ({
        url: "/api/timer/time",
        method: "GET",
      }),
      // Add caching for weekly focus time
      keepUnusedDataFor: 300, // Keep data for 5 minutes
      refetchOnMountOrArgChange: false,
      refetchOnWindowFocus: false,
    }),
  }),
});

export const {
  useStartTimerMutation,
  useGetCurrentTimerQuery,
  usePauseTimerMutation,
  useResumeTimerMutation,
  useCompleteTimerMutation,
  useCancelTimerMutation,
  useGetTimerLogsQuery,
  useGetWeeklyFocusTimeQuery,
} = timerApi;