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
        url: "/auth/me",
        method: "GET",
      }),
    }),
    forgetPassword: builder.mutation({
      query: (body) => ({
        url: "/auth/forget-password",
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          removeAuthToken();
        }
      },
    }),
    updateProfile: builder.mutation({
      query: (body) => ({
        url: "/auth/update-profile",
        method: "PUT",
        body,
        formData: true,
      }),
      invalidatesTags: ["Me"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useMeQuery,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useLogoutMutation,
  useUpdateProfileMutation,
} = authApi;