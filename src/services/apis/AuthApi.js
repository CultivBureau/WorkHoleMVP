import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuthToken, setAuthToken, removeAuthToken } from "../../utils/page";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/auth`,
    prepareHeaders: (headers) => {
      const token = getAuthToken();
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.access_token) setAuthToken(data.access_token);
        } catch {}
      },
    }),
    register: builder.mutation({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
      }),
    }),
    me: builder.query({
      query: () => ({
        url: "/me",
        method: "GET",
      }),
    }),
    forgetPassword: builder.mutation({
      query: (body) => ({
        url: "/forget-password",
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation({
      query: (body) => ({
        url: "/reset-password",
        method: "POST",
        body,
      }),
    }),
    logout: builder.mutation({
      queryFn: async () => {
        removeAuthToken();
        return { data: true };
      },
    }),
    updateProfile: builder.mutation({
      query: (body) => ({
        url: "/update-profile",
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