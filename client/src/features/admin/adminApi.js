import { api } from "../../services/api";

export const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminStats: builder.query({
      query: () => "/api/admin/stats",
      providesTags: ["AdminStats"],
    }),
  }),
});

export const { useGetAdminStatsQuery } = adminApi;
