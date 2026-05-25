import { api } from "../../services/api";

export const plansApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPlans: builder.query({
      query: () => "api/plan",
      providesTags: ["Plans"],
    }),
    getMyMembership: builder.query({
      query: () => "api/plan/me",
      providesTags: ["Membership"],
    }),
    addPlan: builder.mutation({
      query: (plan) => ({
        url: "api/plan",
        method: "POST",
        body: plan,
      }),
      invalidatesTags: ["Plans"],
    }),
    updatePlan: builder.mutation({
      query: ({ id, ...plan }) => ({
        url: `api/plan/${id}`,
        method: "PUT",
        body: plan,
      }),
      invalidatesTags: ["Plans"],
    }),
    deletePlan: builder.mutation({
      query: (id) => ({
        url: `api/plan/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Plans"],
    }),
  }),
});

export const {
  useGetPlansQuery,
  useGetMyMembershipQuery,
  useAddPlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
} = plansApi;
