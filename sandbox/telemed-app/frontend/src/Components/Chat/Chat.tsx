import { Box, Divider, Paper, Typography } from "@mui/material";
import { MessageLeft } from "./MessageLeft";
import { MessageRight } from "./MessageRight";
import { TextInput } from "./TextInput";
import { chatStyles } from "./chatStyles";
import { usePubNub } from "pubnub-react";
import { useEffect, useState } from "react";
import Pubnub from "pubnub";
import { messageAdapter } from "./messageAdapter";
import { ServerNotificationResponse } from "../Notification";
import { useAppSelector } from "../../redux/hooks";
import { selectCurrentUser } from "../../redux/user/userSlice";

export interface Message {
  body: {
    sender: string;
    message: string;
  };
  userName: string;
  timestamp?: string;
}

export interface ChatProps {
  chatChannelUuid: string;
}

export const Chat: React.FC<ChatProps> = ({ chatChannelUuid }) => {
  const userName = useAppSelector(selectCurrentUser)?.username;

  const pubnub = usePubNub();
  const [channels] = useState([chatChannelUuid]);
  const [messages, setMessages] = useState<Message[]>([]);

  const handleMessage = (event: Pubnub.MessageEvent) => {
    const newMessage = messageAdapter(event as ServerNotificationResponse);
    setMessages((previousMessages) => [...previousMessages, newMessage]);
  };

  useEffect(() => {
    const listenerParams: Pubnub.ListenerParameters = {
      message: handleMessage,
      status: (event) => console.debug("Event: ", event),
    };
    pubnub.addListener(listenerParams);

    pubnub.subscribe({ channels });

    return () => {
      pubnub.unsubscribe({ channels });
      pubnub.removeListener(listenerParams);
    };
  }, [pubnub, channels]);

  return (
    <Box sx={chatStyles.container}>
      <Box>
        <Typography variant="h6" textAlign={"center"}>
          Chat
        </Typography>
        <Divider />
      </Box>
      <Paper elevation={0} id="style-1" sx={chatStyles.messagesBody}>
        {messages.map((message, index) => {
          console.debug(message);
          return (
            <>
              {message.body.sender === userName ? (
                <MessageRight
                  message={message.body.message}
                  timestamp={message.timestamp}
                  key={`right-${index}`}
                />
              ) : (
                <MessageLeft
                  userName={message.userName}
                  message={message.body.message}
                  timestamp={message.timestamp}
                  key={`left-${index}`}
                />
              )}
            </>
          );
        })}
      </Paper>
      <TextInput />
    </Box>
  );
};
