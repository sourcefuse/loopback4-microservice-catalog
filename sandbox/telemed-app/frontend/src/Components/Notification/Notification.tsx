import { useEffect, useState } from "react";
import { usePubNub } from "pubnub-react";
import { adaptNotification } from "./notificationAdapter";
import Pubnub from "pubnub";
import EditIcon from "@mui/icons-material/Edit";
import patientAvatar from "./../../Assets/patient-icon.png";
import CallIcon from "@mui/icons-material/Call";
import BlockIcon from "@mui/icons-material/Block";
import CallEndIcon from "@mui/icons-material/CallEnd";
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import Button from "../Button/Button";
import { createSearchParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

export interface ServerNotificationResponse {
  channel: string;
  actualChannel: string;
  subscribedChannel: string;
  timetoken: string;
  publisher: string;
  message: {
    title: string;
    description: string;
    pnGcm?: {
      notification: {
        title: string;
        description: string;
      };
    };
    pnApns?: {
      aps: {
        alert: {
          title: string;
          description: string;
        };
        key: string;
        sound: string;
      };
      pnPush: Array<{ targets: [any]; version: string }>;
    };
  };
}

export interface NotificationData {
  title: string;
  description: {
    token: string;
    name: string;
    sessionId: string;
    additionalMessage?: string;
  };
  sender: string;
}

export interface NotificationListProps {
  notificationChannelUuid: string;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  notificationChannelUuid,
}) => {
  const navigate = useNavigate();

  const pubnub = usePubNub();
  const [channels] = useState([notificationChannelUuid]);

  const [notifications, setNotifications] = useState<NotificationData[]>([
    /* {
      description: {
        name: "Test Patient",
        sessionId: "asdf",
        token: "asd",
      },
      sender: "test.patient@sourefuse.com",
      title: "test.patient@sourefuse.com",
    }, */
  ]);

  const handleMessage = (event: Pubnub.MessageEvent) => {
    const newNotification = adaptNotification(
      event as ServerNotificationResponse
    );

    setNotifications((prevNotifications) => [
      ...prevNotifications,
      newNotification,
    ]);
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

  const handleAcceptInvitation = (token: string, sessionId: string) => {
    navigate({
      pathname: "/videoCall",
      search: createSearchParams({ token, sessionId }).toString(),
    });
  };
  const tomorrowStr = dayjs().add(1, "day").format("DD MMM");

  return (
    <Paper sx={{ padding: "1rem" }} elevation={24}>
      <Typography variant="h5" textAlign={"center"} sx={{ padding: "1rem" }}>
        Upcoming Calls
      </Typography>
      <Divider />
      <Box
        sx={{
          maxHeight: "350px",
          overflow: "auto",
          display: "grid",
          gap: "1rem",
          justifyContent: "strech",
          paddingTop: "2rem",
          paddingBottom: "2rem",
          "& > *": {
            width: "100%",
            maxWidth: "80%",
            margin: "0 auto",
          },
        }}
      >
        {notifications.map((notification, index) => {
          return (
            <Box
              key={`notification-${index}`}
              sx={{ padding: "1rem", margin: "0 auto" }}
            >
              <Card className="animate__animated animate__pulse animate__infinite">
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    sx={{ fontWeight: "lighter" }}
                  >
                    On-demand Request
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <Grid container gap={2}>
                      <Grid item>
                        <Avatar
                          alt={notification.description.name}
                          src={patientAvatar}
                        />
                      </Grid>
                      <Grid item>
                        <Typography variant="subtitle1">
                          {notification.description.name}
                        </Typography>
                        <Typography variant="subtitle2">
                          {notification.title}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "end" }}>
                  <Button
                    color="error"
                    size="medium"
                    startIcon={<CallEndIcon />}
                  >
                    Decline
                  </Button>
                  <Button
                    onClick={() =>
                      void handleAcceptInvitation(
                        notification.description.token,
                        notification.description.sessionId
                      )
                    }
                    color="success"
                    startIcon={<CallIcon />}
                    size="medium"
                  >
                    Accept
                  </Button>
                </CardActions>
              </Card>
            </Box>
          );
        })}
        <Card sx={{ maxWidth: 345 }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              <Grid container gap={2}>
                <Grid item>
                  <Avatar
                    alt="Rajat"
                    src="https://randomuser.me/api/portraits/men/39.jpg"
                  />
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1">Rajat</Typography>
                  <Typography variant="subtitle2">
                    {tomorrowStr} • 11:00 AM • 15Min
                  </Typography>
                </Grid>
              </Grid>
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: "end" }}>
            <Button color="warning" size="small" startIcon={<BlockIcon />}>
              Cancel
            </Button>
            <Button color="secondary" startIcon={<EditIcon />} size="small">
              Reschedule
            </Button>
          </CardActions>
        </Card>
        <Card sx={{ maxWidth: 345 }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              <Grid container gap={2}>
                <Grid item>
                  <Avatar
                    alt="Aabraham"
                    src="https://randomuser.me/api/portraits/men/38.jpg"
                  />
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1">Akshay</Typography>
                  <Typography variant="subtitle2">
                    {tomorrowStr} • 02:30 PM • 20Min
                  </Typography>
                </Grid>
              </Grid>
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: "end" }}>
            <Button color="warning" size="small" startIcon={<BlockIcon />}>
              Cancel
            </Button>
            <Button color="secondary" startIcon={<EditIcon />} size="small">
              Reschedule
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Paper>
  );
};
