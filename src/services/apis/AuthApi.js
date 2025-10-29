import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import { setAuthToken, removeAuthToken, setToken } from "../../utils/page";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: "/api/v1/Authentication/login",
        method: "POST",
        body,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Handle new API response structure with 'value' wrapper
          if (data.value?.token) {
            setToken(data.value.token);
          } else if (data.token) {
            setToken(data.token);
          }
        } catch {}
      },
    }),
    register: builder.mutation({
      query: (body) => ({
        url: "/api/v1/Authentication/register",
        method: "POST",
        body,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Handle new API response structure with 'value' wrapper
          if (data.value?.token) {
            setToken(data.value.token);
          } else if (data.token) {
            setToken(data.token);
          }
        } catch {}
      },
    }),
    me: builder.query({
      query: () => ({
        url: "/api/v1/Authentication/me",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useMeQuery,
} = authApi;