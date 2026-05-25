import { api } from "../../services/api";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({

    login: builder.mutation({
      query: (data) => ({
        url: "/api/users/login",
        method: "POST",
        body: data,
      }),
    }),
   logout: builder.mutation({
      query: (refreshToken) => ({
        url: "/api/users/logout",
        method: "POST",
        body: { token: refreshToken }
      })
    })
,
    register: builder.mutation({
      query: (data) => ({
        url: "/api/users",
        method: "POST",
        body: data,
      }),
    }),

  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
   useLogoutMutation // 👈 זה מה שנוסף
} = authApi;