import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const clockinLogApi = createApi({
  reducerPath: "clockinLogApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["ClockinLogs"],
  endpoints: (builder) => ({
    getCompanyClockinLogs: builder.query({
      query: ({ pageNumber = 1, pageSize = 20 } = {}) => ({
        url: "/api/ClockinLogs/company",
        method: "GET",
        params: { pageNumber, pageSize },
      }),
      providesTags: (result) => [{ type: "ClockinLogs", id: "COMPANY_LIST" }],
    }),

    getUserClockinLogs: builder.query({
      query: ({ userId, pageNumber = 1, pageSize = 20 }) => ({
        url: `/api/ClockinLogs/user/${userId}`,
        method: "GET",
        params: { pageNumber, pageSize },
      }),
      providesTags: (result, error, arg) => [
        { type: "ClockinLogs", id: `USER_${arg?.userId || "UNKNOWN"}` },
      ],
    }),

    getClockinLogById: builder.query({
      query: (id) => ({
        url: `/api/ClockinLogs/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "ClockinLogs", id }],
    }),
  }),
});

export const {
  useGetCompanyClockinLogsQuery,
  useGetUserClockinLogsQuery,
  useGetClockinLogByIdQuery,
} = clockinLogApi;


