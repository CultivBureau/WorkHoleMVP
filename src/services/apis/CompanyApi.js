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
    updateCompanyDetails: builder.mutation({
      query: ({ companyId, name, attachments }) => {
        const formData = new FormData();
        
        // Add company name - API expects "Name" with capital N
        if (name) {
          formData.append("Name", name);
        }
        
        // Add attachments array
        if (attachments && Array.isArray(attachments)) {
          attachments.forEach((attachment, index) => {
            if (attachment.id !== undefined && attachment.id !== null) {
              formData.append(`Attachments[${index}].id`, attachment.id.toString());
            }
            if (attachment.file) {
              formData.append(`Attachments[${index}].file`, attachment.file);
            }
            if (attachment.expiryDate) {
              formData.append(`Attachments[${index}].expiryDate`, attachment.expiryDate);
            }
          });
        }
        
        return {
          url: `/api/v1/Company/UpdateDetails/${companyId}/details`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["Company"],
    }),
  }),
});

export const { 
  useGetUserCompaniesByEmailMutation,
  useGetCompanyByIdQuery,
  useUpdateCompanyMutation,
  useUpdateCompanyDetailsMutation,
} = companyApi;
