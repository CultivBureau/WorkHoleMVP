import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const shiftApi = createApi({
  reducerPath: "shiftApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getAllShifts: builder.query({
      query: ({ pageNumber = 1, pageSize = 10 } = {}) => ({
        url: "/api/v1/Shift/GetAll",
        method: "GET",
        params: {
          pageNumber,
          pageSize,
        },
      }),
    }),

    // Assign shift to a user
    assignUserShift: builder.mutation({
      query: (body) => ({
        url: "/api/v1/Shift/AssignUser/assignments",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useGetAllShiftsQuery, useAssignUserShiftMutation } = shiftApi;

