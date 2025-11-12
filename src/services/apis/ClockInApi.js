import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const clockInApi = createApi({
  reducerPath: "clockInApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["ClockInLogs"],
  endpoints: (builder) => ({
    // Get clock-in logs for user profile
    getUserProfileClockInLogs: builder.query({
      query: ({ userId, pageNumber = 1, pageSize = 20 } = {}) => {
        const params = {
          pageNumber,
          pageSize,
        };
        return {
          url: `/api/ClockinLogs/user/profile/${userId}`,
          method: "GET",
          params,
        };
      },
      providesTags: (result, error, { userId }) => [
        { type: "ClockInLogs", id: `user-${userId}` },
      ],
    }),
  }),
});

export const {
  useGetUserProfileClockInLogsQuery,
} = clockInApi;

