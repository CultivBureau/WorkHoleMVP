import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const attendanceApi = createApi({
  reducerPath: "attendanceApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    // Clock In
    clockIn: builder.mutation({
      query: (body) => ({
        url: "/api/attendance/clock-in",
        method: "POST",
        body,
      }),
    }),
    // Clock Out
    clockOut: builder.mutation({
      query: (body) => ({
        url: "/api/attendance/clock-out",
        method: "POST",
        body,
      }),
    }),
    // Get Dashboard (me)
    getDashboard: builder.query({
      query: ({ filter = "week" } = {}) => ({
        url: `/api/attendance/me?filter=${filter}`,
        method: "GET",
      }),
    }),
    // Get Stats (pagination)
    getStats: builder.query({
      query: ({ page = 1, limit = 8 }) => ({
        url: `/api/attendance/stats?page=${page}&limit=${limit}`,
        method: "GET",
      }),
    }),
    // Get Attendance Logs
    getAttendanceLogs: builder.query({
      query: ({ page = 1, limit = 10, filter = "all" } = {}) => ({
        url: `/api/attendance/logs?page=${page}&limit=${limit}&filter=${filter}`,
        method: "GET",
      }),
    }),
    // Get Attendance by Date Range
    getAttendanceByDateRange: builder.query({
      query: ({ startDate, endDate, page = 1, limit = 10 } = {}) => ({
        url: `/api/attendance/date-range?startDate=${startDate}&endDate=${endDate}&page=${page}&limit=${limit}`,
        method: "GET",
      }),
    }),
    // Get Attendance Summary
    getAttendanceSummary: builder.query({
      query: ({ month, year } = {}) => ({
        url: `/api/attendance/summary?month=${month || new Date().getMonth() + 1}&year=${year || new Date().getFullYear()}`,
        method: "GET",
      }),
    }),
    // Admin: Get all users attendance
    getAllUsersAttendance: builder.query({
      query: (range = "today") => ({
        url: `/api/attendance/all?range=${range}`,
        method: "GET",
      }),
    }),
    // Admin: Set office location
    setOfficeLocation: builder.mutation({
      query: (body) => ({
        url: "/api/attendance/set-office-location",
        method: "POST",
        body,
      }),
    }),
    // Admin: Get all offices
    getAllOffices: builder.query({
      query: () => ({
        url: "/api/attendance/offices",
        method: "GET",
      }),
    }),
    // Admin: Edit office
    editOffice: builder.mutation({
      query: (body) => ({
        url: "/api/attendance/edit-office",
        method: "POST",
        body,
      }),
    }),
    // Admin: Delete office
    deleteOffice: builder.mutation({
      query: (body) => ({
        url: "/api/attendance/delete-office",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useClockInMutation,
  useClockOutMutation,
  useGetDashboardQuery,
  useGetStatsQuery,
  useGetAttendanceLogsQuery,
  useGetAttendanceByDateRangeQuery,
  useGetAttendanceSummaryQuery,
  useGetAllUsersAttendanceQuery,
  useSetOfficeLocationMutation,
  useGetAllOfficesQuery,
  useEditOfficeMutation,
  useDeleteOfficeMutation,
} = attendanceApi;