import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const departmentApi = createApi({
  reducerPath: "departmentApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getAllDepartments: builder.query({
      query: ({ pageNumber = 1, pageSize = 20 } = {}) => ({
        url: "/api/v1/Department/GetAll",
        method: "GET",
        params: {
          pageNumber,
          pageSize,
        },
      }),
    }),
  }),
});

export const { useGetAllDepartmentsQuery } = departmentApi;

