import { useState } from "react";
import {
  Notification,
  useCreateNotificationMutation,
} from "../api/notificationApiSlice";
import useConfig from "./useConfig";
import { useAppSelector } from "../redux/hooks";
import { selectCurrentUser } from "../redux/user/userSlice";

/**
 * We are using notification service to push messages via pubnub
 */
export const useChat = () => {
  const { notificationApiBaseUrl, chatChannelUuid } = useConfig().config;
  const user = useAppSelector(selectCurrentUser)!;

  const [loading, setLoading] = useState<boolean>(false);

  const [createNotificationApi] = useCreateNotificationMutation();

  const handleSendMessage = async (messageBody: string) => {
    try {
      setLoading(true);
      const message: Notification = {
        subject: `${user.firstName} ${user.lastName ?? ""}`,
        body: JSON.stringify({
          sender: user.username,
          message: messageBody,
        }),
        type: 0,
        options: {},
        receiver: {
          to: [
            {
              type: 0,
              id: chatChannelUuid,
            },
          ],
        },
      };
      await createNotificationApi({ url: notificationApiBaseUrl, ...message });
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return {
    handleSendMessage,
    loading,
  };
};
