import { api } from "../../services/api";

export const instructorsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getInstructors: builder.query({
      query: () => "/api/instructors",
      providesTags: ["Instructors"],
    }),
    getInstructorById: builder.query({
      query: (id) => `/api/instructors/${id}`,
      providesTags: ["Instructors"],
    }),
    addInstructor: builder.mutation({
      query: (instructor) => ({
        url: "/api/instructors",
        method: "POST",
        body: instructor,
      }),
      invalidatesTags: ["Instructors"],
    }),
    updateInstructor: builder.mutation({
      query: ({ id, ...instructor }) => ({
        url: `/api/instructors/${id}`,
        method: "PUT",
        body: instructor,
      }),
      invalidatesTags: ["Instructors"],
    }),
    deleteInstructor: builder.mutation({
      query: (id) => ({
        url: `/api/instructors/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Instructors"],
    }),
  }),
});

export const {
  useGetInstructorsQuery,
  useGetInstructorByIdQuery,
  useAddInstructorMutation,
  useUpdateInstructorMutation,
  useDeleteInstructorMutation,
} = instructorsApi;
