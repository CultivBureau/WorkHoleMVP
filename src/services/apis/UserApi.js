import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // Get all users with optional filters
    getAllUsers: builder.query({
      query: ({ departmentId, teamId, name, pageNumber = 1, pageSize = 100 } = {}) => {
        const params = { pageNumber, pageSize };
        if (departmentId) params.departmentId = departmentId;
        if (teamId) params.teamId = teamId;
        if (name) params.name = name;
        
        return {
          url: "/api/v1/User/GetAll",
          method: "GET",
          params,
        };
      },
      providesTags: ["User"],
    }),

    // Create a new user
    createUser: builder.mutation({
      query: (body) => ({
        url: "/api/v1/User/Create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // Update an existing user
    updateUser: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/api/v1/User/Update/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // Delete a user
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/api/v1/User/Delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;

