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
} = timerApi;