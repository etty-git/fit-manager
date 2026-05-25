import { api } from "../../services/api";

export const messagesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: () => "/api/messages",
      providesTags: ["Messages"],
    }),
    sendMessage: builder.mutation({
      query: (message) => ({
        url: "/api/messages",
        method: "POST",
        body: message,
      }),
      invalidatesTags: ["Messages"],
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useSendMessageMutation,
} = messagesApi;
