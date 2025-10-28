import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const companyApi = createApi({
  reducerPath: "companyApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getUserCompaniesByEmail: builder.mutation({
      query: (email) => ({
        url: "/api/v1/User/GetUserCompaniesByEmail",
        method: "POST",
        body: { Email: email },
      }),
    }),
  }),
});

export const { useGetUserCompaniesByEmailMutation } = companyApi;
