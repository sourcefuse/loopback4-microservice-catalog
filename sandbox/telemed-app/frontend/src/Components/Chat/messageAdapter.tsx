import { Message } from ".";
import { ServerNotificationResponse } from "../Notification";

export const messageAdapter = (
  serverResponse: ServerNotificationResponse
): Message => {
  const { message, timetoken } = serverResponse;
  const description = JSON.parse(message.description) as {
    sender: string;
    message: string;
  };

  const unixTimestamp = +timetoken / 10000000;
  const date = new Date(unixTimestamp * 1000);
  const hours = date.getHours();
  const minutes = `0${date.getMinutes()}`.substr(-2);

  return {
    body: {
      sender: description.sender,
      message: description.message,
    },
    userName: message.title,
    timestamp: `${hours}:${minutes}`,
  };
};
