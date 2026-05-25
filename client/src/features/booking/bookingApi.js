import { api } from "../../services/api";

export const bookingApi = api.injectEndpoints({
  endpoints: (builder) => ({

    // ================= CREATE BOOKING =================
    createBooking: builder.mutation({
      query: (data) => ({
        url: "/api/bookings",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Booking", "Classes"], // 🔥 חשוב
    }),

    // ================= MY BOOKINGS =================
    getMyBookings: builder.query({
      query: () => "/api/bookings/my",
      providesTags: ["Booking"],
    }),

    // ================= CANCEL BOOKING =================
    cancelBooking: builder.mutation({
      query: (id) => ({
        url: `/api/bookings/cancel/${id}`,
        method: "PATCH",
      }),

      // 🔥 זה מה שמעדכן הכל בזמן אמת
      invalidatesTags: ["Booking", "Classes"],
    }),

  }),
});

export const {
  useCreateBookingMutation,
  useGetMyBookingsQuery,
  useCancelBookingMutation,
} = bookingApi;