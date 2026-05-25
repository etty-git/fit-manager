import { api } from "../../services/api";

export const paymentsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query({
      query: () => "/api/payments",
      providesTags: ["Payments"],
    }),
    createPayment: builder.mutation({
      query: (payload) => ({
        url: "/api/payments",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Payments"],
    }),
    payPayment: builder.mutation({
  query: (paymentId) => ({
    url: "/api/payments/pay",
    method: "POST",
    body: { paymentId },
  }),
      invalidatesTags: ["Membership", "Classes", "Booking", "Payments"],
    }),
  }),
});

export const {
  useGetPaymentsQuery,
  useCreatePaymentMutation,
  usePayPaymentMutation,
} = paymentsApi;
