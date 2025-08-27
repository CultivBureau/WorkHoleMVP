import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuthToken } from "../../utils/page";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api/dashboard`,
    prepareHeaders: (headers) => {
      const token = getAuthToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getDashboard: builder.query({
      query: () => ({
        url: "me",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetDashboardQuery } = dashboardApi;