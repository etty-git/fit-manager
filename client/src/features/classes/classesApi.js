import { api } from "../../services/api";

export const classesApi = api.injectEndpoints({
  endpoints: (builder) => ({

    // 🔥 כל הכיתות
    getClasses: builder.query({
      query: () => "/api/classes",
      providesTags: ["Classes"],
    }),

    // 🔐 כיתות של המשתמש המחובר
    getMyClasses: builder.query({
      query: () => "/api/classes/my",
      providesTags: ["Classes"],
    }),

    // 🔍 כיתה לפי ID
    getClassById: builder.query({
      query: (id) => `/api/classes/${id}`,
    }),

    // ➕ הוספת שיעור (admin)
    addClass: builder.mutation({
      query: (newClass) => ({
        url: "/api/classes",
        method: "POST",
        body: newClass,
      }),
      invalidatesTags: ["Classes"],
    }),

    // ✏️ עריכת שיעור (admin)
    updateClass: builder.mutation({
      query: ({ id, ...updatedClass }) => ({
        url: `/api/classes/${id}`,
        method: "PUT",
        body: updatedClass,
      }),
      invalidatesTags: ["Classes"],
    }),

    // 🗑️ מחיקת שיעור (admin)
    deleteClass: builder.mutation({
      query: (id) => ({
        url: `/api/classes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Classes"],
    }),

  }),
});

export const {
  useGetClassesQuery,
  useGetMyClassesQuery,
  useGetClassByIdQuery,
  useAddClassMutation,
  useUpdateClassMutation,
  useDeleteClassMutation,
} = classesApi;