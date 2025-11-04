import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    // Get user by ID
    getUserById: builder.query({
      query: (userId) => ({
        url: `/api/v1/User/GetById/${userId}`,
        method: "GET",
      }),
      providesTags: (result, error, userId) => [{ type: "Users", id: userId }],
    }),

    // Get multiple users by IDs (if your API supports it)
    getUsersByIds: builder.query({
      query: (userIds) => ({
        url: `/api/v1/User/GetByIds`,
        method: "POST",
        body: { userIds },
      }),
      providesTags: (result) => [{ type: "Users", id: "LIST" }],
    }),
  }),
  tagTypes: ["Users"],
});

export const { useGetUserByIdQuery, useGetUsersByIdsQuery } = userApi;

