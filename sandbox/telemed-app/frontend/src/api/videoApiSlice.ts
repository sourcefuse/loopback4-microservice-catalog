import { apiSlice } from "../redux/apiSlice";

export type MeetingLink = {
  meetingLink: string;
};

export type TokenResponse = {
  token: string;
  sessionId: string;
};

export const videoApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createMeetingLink: builder.mutation<
      MeetingLink | TokenResponse,
      { url: string }
    >({
      query: ({ url }) => ({
        url: url,
        method: "POST",
        body: {},
      }),
    }),
  }),
});

export const { useCreateMeetingLinkMutation } = videoApiSlice;
