import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const companyApi = createApi({
  reducerPath: "companyApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Company"],
  endpoints: (builder) => ({
    getUserCompaniesByEmail: builder.mutation({
      query: (email) => ({
        url: "/api/v1/User/GetUserCompaniesByEmail",
        method: "POST",
        body: { Email: email },
      }),
    }),
    getCompanyById: builder.query({
      query: (id) => ({
        url: `/api/v1/Company/GetById/${id}`,
        method: "GET",
      }),
      providesTags: ["Company"],
    }),
    updateCompany: builder.mutation({
      query: ({ companyId, name }) => ({
        url: `/api/v1/Company/Update/${companyId}`,
        method: "PUT",
        body: { name },
      }),
      invalidatesTags: ["Company"],
    }),
  }),
});

export const { 
  useGetUserCompaniesByEmailMutation,
  useGetCompanyByIdQuery,
  useUpdateCompanyMutation,
} = companyApi;
