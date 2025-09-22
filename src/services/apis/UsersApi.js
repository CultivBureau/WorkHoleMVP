import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => ({
        url: "/api/users",
        method: "GET",
      }),
      providesTags: ["Users"],
    }),
    getUserById: builder.query({
      query: (id) => ({
        url: `/api/users/${id}`,
        method: "GET",
      }),
    }),
    createUser: builder.mutation({
      query: (body) => ({
        url: "/api/users",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/api/users/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Users"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/api/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;