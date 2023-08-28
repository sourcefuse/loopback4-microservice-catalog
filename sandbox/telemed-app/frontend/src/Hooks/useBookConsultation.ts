import {
  Notification,
  useCreateNotificationMutation,
} from "../api/notificationApiSlice";
import {
  MeetingLink,
  TokenResponse,
  useCreateMeetingLinkMutation,
} from "../api/videoApiSlice";
import useConfig from "../Hooks/useConfig";
import { useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { selectCurrentUser } from "../redux/user/userSlice";

export const useBookConsultation = () => {
  const { videoApiBaseUrl, notificationApiBaseUrl, notificationChannelUuid } =
    useConfig().config;
  const user = useAppSelector(selectCurrentUser)!;

  const [meetingLink, setMeetingLink] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [createMeetingLinkApi] = useCreateMeetingLinkMutation();
  const [createNotificationApi] = useCreateNotificationMutation();

  const handleBookConsultation = async () => {
    try {
      setLoading(true);
      const meetingLinkResponse = (await createMeetingLinkApi({
        url: `${videoApiBaseUrl}/session`,
      }).unwrap()) as MeetingLink;

      console.debug("New Meeting Link: ", meetingLinkResponse.meetingLink);

      const tokenResponse = (await createMeetingLinkApi({
        url: `${videoApiBaseUrl}/session/${meetingLinkResponse.meetingLink}/token`,
      }).unwrap()) as TokenResponse;

      const message: Notification = {
        subject: user.username,
        body: JSON.stringify({
          name: user.firstName.concat(" ", user.lastName ?? ""),
          token: tokenResponse.token,
          sessionId: tokenResponse.sessionId,
        }),
        type: 0,
        options: {},
        receiver: {
          to: [
            {
              type: 0,
              id: notificationChannelUuid,
            },
          ],
        },
      };
      await createNotificationApi({ url: notificationApiBaseUrl, ...message });

      setMeetingLink(meetingLinkResponse.meetingLink);
      setSessionId(tokenResponse.sessionId);
      setToken(tokenResponse.token);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    meetingLink,
    handleBookConsultation,
    sessionId,
    token,
    loading,
  };
};
