import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const leaveApi = createApi({
  reducerPath: "leaveApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["LeaveRequests"],
  endpoints: (builder) => ({
    // Get all team lead leave requests (paginated)
    getAllTeamLeadRequests: builder.query({
      query: ({ pageNumber = 1, pageSize = 20 } = {}) => ({
        url: "/api/v1/LeaveRequest/GetAllTeamLead/team",
        method: "GET",
        params: {
          pageNumber,
          pageSize,
        },
      }),
      providesTags: (result) => [
        { type: "LeaveRequests", id: "TEAM_LEAD_LIST" },
      ],
    }),

    // Team lead review (approve/reject)
    teamLeadReview: builder.mutation({
      query: ({ requestId, isApproved, comment }) => ({
        url: `/api/v1/LeaveRequest/TeamLeadReview/${requestId}/review`,
        method: "PUT",
        body: {
          isApproved,
          comment: comment || "",
        },
      }),
      invalidatesTags: [
        { type: "LeaveRequests", id: "TEAM_LEAD_LIST" },
        { type: "LeaveRequests", id: "HR_LIST" },
      ],
    }),

    // Get all HR leave requests (paginated) - Only shows approved requests
    getAllHrRequests: builder.query({
      query: ({ pageNumber = 1, pageSize = 20 } = {}) => ({
        url: "/api/v1/LeaveRequest/GetAllHr/hr",
        method: "GET",
        params: {
          pageNumber,
          pageSize,
        },
      }),
      providesTags: (result) => [
        { type: "LeaveRequests", id: "HR_LIST" },
      ],
    }),

    // HR confirm leave request
    hrConfirm: builder.mutation({
      query: ({ requestId, isConfirmed, comment }) => ({
        url: `/api/v1/LeaveRequest/HrConfirm/${requestId}/confirm`,
        method: "PUT",
        body: {
          isConfirmed,
          comment: comment || "",
        },
      }),
      invalidatesTags: [
        { type: "LeaveRequests", id: "HR_LIST" },
        { type: "LeaveRequests", id: "TEAM_LEAD_LIST" },
      ],
    }),

    // HR override leave request
    hrOverride: builder.mutation({
      query: ({ requestId, forceApprove, justification }) => ({
        url: `/api/v1/LeaveRequest/HrOverride/${requestId}/override`,
        method: "PUT",
        body: {
          forceApprove,
          justification: justification || "",
        },
      }),
      invalidatesTags: [
        { type: "LeaveRequests", id: "HR_LIST" },
        { type: "LeaveRequests", id: "TEAM_LEAD_LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllTeamLeadRequestsQuery,
  useTeamLeadReviewMutation,
  useGetAllHrRequestsQuery,
  useHrConfirmMutation,
  useHrOverrideMutation,
} = leaveApi;

