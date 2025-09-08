import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuthToken } from "../../utils/page";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const attendanceApi = createApi({
  reducerPath: "attendanceApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      // JWT from cookies (if you use cookies for auth)
      const token = getAuthToken(); // should read from cookies
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
    credentials: "include", // send cookies
  }),
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
  useGetAllUsersAttendanceQuery,
  useSetOfficeLocationMutation,
  useGetAllOfficesQuery,
  useEditOfficeMutation,
  useDeleteOfficeMutation,
} = attendanceApi;