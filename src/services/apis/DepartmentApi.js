import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const departmentApi = createApi({
  reducerPath: "departmentApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    // Get all departments (paginated)
    getAllDepartments: builder.query({
      query: ({ pageNumber = 1, pageSize = 20 } = {}) => ({
        url: "/api/v1/Department/GetAll",
        method: "GET",
        params: {
          pageNumber,
          pageSize,
        },
      }),
      providesTags: (result) => [{ type: "Departments", id: "LIST" }],
    }),

    // Get a single department by id
    getDepartmentById: builder.query({
      query: (id) => ({
        url: `/api/Department/${id}`,
        method: "GET",
      }),
    }),

    // Create a new department
    createDepartment: builder.mutation({
      query: (body) => ({
        url: "/api/v1/Department/Create",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Departments", id: "LIST" }],
    }),

    // Update an existing department
    updateDepartment: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/api/v1/Department/Update/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "Departments", id: "LIST" }],
    }),

    // Soft delete a department
    deleteDepartment: builder.mutation({
      query: (id) => ({
        url: `/api/v1/Department/Delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Departments", id: "LIST" }],
    }),

    // Restore a soft-deleted department
    restoreDepartment: builder.mutation({
      query: (id) => ({
        url: `/api/v1/Department/Restore/${id}`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Departments", id: "LIST" }],
    }),

    // Get department supervisor
    getDepartmentSupervisor: builder.query({
      query: (id) => ({
        url: `/api/v1/Department/GetSupervisor/${id}`,
        method: "GET",
      }),
    }),

    // Assign supervisor
    assignSupervisor: builder.mutation({
      query: ({ id, userId }) => ({
        url: `/api/Department/${id}/supervisor/${userId}`,
        method: "PUT",
      }),
      invalidatesTags: ["Departments"],
    }),

    // Remove supervisor
    removeSupervisor: builder.mutation({
      query: (id) => ({
        url: `/api/Department/${id}/remove-supervisor`,
        method: "PUT",
      }),
      invalidatesTags: ["Departments"],
    }),
  }),
  tagTypes: ["Departments"],
});

export const {
  useGetAllDepartmentsQuery,
  useGetDepartmentByIdQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  useRestoreDepartmentMutation,
  useGetDepartmentSupervisorQuery,
  useAssignSupervisorMutation,
  useRemoveSupervisorMutation,
} = departmentApi;

