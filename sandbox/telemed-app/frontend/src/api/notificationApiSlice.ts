import { apiSlice } from "../redux/apiSlice";

export interface Subscriber {
  id: string;
  name?: string;
  [key: string]: any;
}
export interface Receiver {
  to: Subscriber[];
}
export interface Notification {
  subject: string;
  body: string;
  receiver: Receiver;
  type: number;
  options: Record<string, any>;
}

interface NotificationApiArgs extends Notification {
  url: string;
}

export const notificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createNotification: builder.mutation<any, NotificationApiArgs>({
      query: ({ url, ...notification }) => ({
        url: `${url}/notifications`,
        method: "POST",
        body: { ...notification },
      }),
    }),
  }),
});

export const { useCreateNotificationMutation } = notificationApiSlice;
