import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const leavesApi = createApi({
    reducerPath: "leavesApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Leaves", "LeaveStats", "AdminLeaves"],
    endpoints: (builder) => ({
        // Get my leaves (paginated)
        getMyLeaves: builder.query({
            query: ({ page = 1, limit = 6 } = {}) =>
                `/api/leaves/me?page=${page}&limit=${limit}`,
            providesTags: ["Leaves"],
        }),
        // Get my leave stats
        getLeaveStats: builder.query({
            query: () => "/api/leaves/stats",
            providesTags: ["LeaveStats"],
        }),
        // Create leave (with optional file)
        createLeave: builder.mutation({
            query: ({ data, file }) => {
                // If file exists, use FormData
                if (file) {
                    const formData = new FormData();
                    Object.entries(data).forEach(([key, value]) =>
                        formData.append(key, value)
                    );
                    formData.append("attachment", file);
                    return {
                        url: "/api/leaves",
                        method: "POST",
                        body: formData,
                    };
                }
                // No file, send JSON
                return {
                    url: "/api/leaves",
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["Leaves", "LeaveStats", "AdminLeaves"],
        }),
        // Update leave (only pending)
        updateLeave: builder.mutation({
            query: ({ id, data }) => ({
                url: `/api/leaves/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Leaves", "LeaveStats", "AdminLeaves"],
        }),
        // Delete leave (only pending)
        deleteLeave: builder.mutation({
            query: (id) => ({
                url: `/api/leaves/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Leaves", "LeaveStats", "AdminLeaves"],
        }),
        // Admin: Get all leaves
        getAllLeaves: builder.query({
            query: () => "/api/leaves/admin/all",
            providesTags: ["AdminLeaves"],
        }),
        // Admin: Approve/Reject leave
        adminAction: builder.mutation({
            query: ({ id, data }) => ({
                url: `/api/leaves/admin/${id}/action`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Leaves", "LeaveStats", "AdminLeaves"],
        }),
    }),
});

export const {
    useGetMyLeavesQuery,
    useGetLeaveStatsQuery,
    useCreateLeaveMutation,
    useUpdateLeaveMutation,
    useDeleteLeaveMutation,
    useGetAllLeavesQuery,
    useAdminActionMutation,
} = leavesApi;