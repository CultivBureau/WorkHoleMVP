import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const teamApi = createApi({
  reducerPath: "teamApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getAllTeams: builder.query({
      query: ({ pageNumber = 1, pageSize = 10 } = {}) => ({
        url: "/api/v1/Team/GetAll/",
        method: "GET",
        params: {
          pageNumber,
          pageSize,
        },
      }),
    }),

    // Create a new team
    createTeam: builder.mutation({
      query: (body) => ({
        url: "/api/v1/Team/Create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Teams"],
    }),

    // Assign user to a team
    assignUserToTeam: builder.mutation({
      query: ({ teamId, userId }) => ({
        url: `/api/v1/Team/AddUserToTeam/${teamId}/users`,
        method: "POST",
        body: { userId, teamId },
      }),
      invalidatesTags: ["Teams"],
    }),

    // Get teams for a department
    getTeamsByDepartment: builder.query({
      query: (departmentId) => ({
        url: `/api/v1/Team/GetByDepartment/department/${departmentId}`,
        method: "GET",
      }),
    }),
  }),
  tagTypes: ["Teams"],
});

export const { useGetAllTeamsQuery, useCreateTeamMutation, useAssignUserToTeamMutation, useGetTeamsByDepartmentQuery } = teamApi;

