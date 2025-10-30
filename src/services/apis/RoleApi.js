import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const roleApi = createApi({
  reducerPath: "roleApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getAllRoles: builder.query({
      query: ({ pageNumber = 1, pageSize = 20 } = {}) => ({
        url: "/api/v1/Role/GetAll",
        method: "GET",
        params: {
          pageNumber,
          pageSize,
        },
      }),
    }),

    // Get users by role id (paginated)
    getRoleUsers: builder.query({
      query: ({ id, pageNumber = 1, pageSize = 20 }) => ({
        url: `/api/v1/Role/GetUsers/${id}/users`,
        method: "GET",
        params: { pageNumber, pageSize },
      }),
    }),
  }),
});

export const { useGetAllRolesQuery, useGetRoleUsersQuery } = roleApi;

