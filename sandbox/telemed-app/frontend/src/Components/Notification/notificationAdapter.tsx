import { NotificationData, ServerNotificationResponse } from ".";

export function adaptNotification(
  serverNotification: ServerNotificationResponse
): NotificationData {
  const { message, publisher } = serverNotification;
  const description = JSON.parse(message.description) as {
    name: string;
    token: string;
    sessionId: string;
  };

  const notification: NotificationData = {
    title: message.title,
    description: {
      name: description.name,
      token: description.token,
      sessionId: description.sessionId,
    },
    sender: publisher,
  };
  return notification;
}
