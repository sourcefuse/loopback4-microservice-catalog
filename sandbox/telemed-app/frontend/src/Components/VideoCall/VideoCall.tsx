/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useRef, useEffect, useState, useCallback } from "react";
import { Box, Fab, Grid, SxProps } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import "./videoCall.css";

import "@vonage/video-publisher/video-publisher.js";
import "@vonage/video-subscribers/video-subscribers.js";
import { Chat } from "../Chat";
import { useNavigate } from "react-router-dom";
import SideNav from "../SideNav/SideNav";
import useConfig from "../../Hooks/useConfig";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace React.JSX {
    interface IntrinsicElements {
      "video-publisher": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & { properties?: OT.PublisherProperties };
      "video-subscribers": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & { properties?: OT.SubscriberProperties };
    }
  }
}

export interface VideoCallProps {
  sessionId: string;
  token: string;
  vonageApiKey: string;
}

export interface VideoPublisherElement extends HTMLElement {
  session: OT.Session;
  token: string;
  properties: OT.PublisherProperties;
  autoPublish: string;
  toggleAudio: () => void;
  toggleVideo: () => void;
}

export interface VideoSubscribersElement extends HTMLElement {
  session: OT.Session;
  token: string;
  properties: OT.SubscriberProperties;
}

export const VideoCall: React.FC<VideoCallProps> = ({
  sessionId,
  token,
  vonageApiKey,
}) => {
  const navigate = useNavigate();

  const publisher = useRef<VideoPublisherElement | null>(null);
  const subscribers = useRef<VideoSubscribersElement | null>(null);

  const [isVideoOn, setIsVideoOn] = useState(true);
  const [ismicOn, setIsMicOn] = useState(true);

  const toggleVideo = () => {
    setIsVideoOn((prevIsVideoOn) => !prevIsVideoOn);
    publisher.current!.toggleVideo();
  };

  const toggleAudio = () => {
    setIsMicOn((prevIsMicOn) => !prevIsMicOn);
    publisher.current!.toggleAudio();
  };

  const handleEndMeet = () => {
    navigate("/home");
  };

  useEffect(() => {
    const OT = window.OT;

    // Set session and token for Web Components
    setTimeout(() => {
      if (publisher.current && subscribers.current) {
        const session = OT.initSession(vonageApiKey, sessionId);

        publisher.current.properties = {
          style: { buttonDisplayMode: "off", audioLevelDisplayMode: "off" },
        };
        publisher.current.session = session;
        publisher.current.token = token;

        subscribers.current.properties = {
          showControls: false,
          style: { buttonDisplayMode: "off", audioLevelDisplayMode: "off" },
        };
        subscribers.current.session = session;
        subscribers.current.token = token;
      }
    });
  }, [sessionId, token]);

  const [open, setOpen] = useState(true);
  const toggleDrawer = useCallback(() => setOpen((prev) => !prev), []);

  const { chatChannelUuid } = useConfig().config;

  return (
    <>
      <Grid container style={{ height: "100vh" }}>
        <Grid item xs={2.5}>
          <SideNav
            isPermanent={true}
            isAppBarFullWidth={false}
            drawerWidth={"100%"}
            toggleDrawer={toggleDrawer}
            open={open}
          />
        </Grid>
        <Grid
          item
          xs={9.5}
          style={{
            height: "100%",
          }}
        >
          <Grid
            container
            sx={{ height: "100%", backgroundColor: "rgb(243, 246, 249)" }}
          >
            <Grid item xs={9}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  height: "100%",
                  padding: "1rem",
                }}
              >
                <Box sx={{ display: "flex" }} gap={2}>
                  <Box sx={videoContainerStyle}>
                    <video-subscribers ref={subscribers}></video-subscribers>
                  </Box>
                  <Box sx={{ transform: "scale(0.9)", ...videoContainerStyle }}>
                    <video-publisher ref={publisher}></video-publisher>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    pb: 2,
                    pt: 2,
                  }}
                >
                  <Fab
                    color="primary"
                    aria-label="Toggle Video"
                    onClick={toggleVideo}
                  >
                    {isVideoOn ? <VideocamIcon /> : <VideocamOffIcon />}
                  </Fab>
                  <Fab
                    color="error"
                    aria-label="End Call"
                    sx={{ marginInline: "5px" }}
                    onClick={handleEndMeet}
                  >
                    <CallEndIcon />
                  </Fab>
                  <Fab
                    color="primary"
                    aria-label="Toggle Audio"
                    onClick={toggleAudio}
                  >
                    {ismicOn ? <MicIcon /> : <MicOffIcon />}
                  </Fab>
                </Box>
              </Box>
            </Grid>
            <Grid
              item
              xs={3}
              sx={{
                alignSelf: "center",
              }}
            >
              {chatChannelUuid ? (
                <Chat chatChannelUuid={chatChannelUuid} />
              ) : null}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

const videoContainerStyle: SxProps = {
  padding: "1rem",
  background: "white",
  borderRadius: "1rem",
  boxShadow: "rgba(17, 12, 46, 0.15) 0px 48px 50px 0px",
  "& > *": {
    borderRadius: "1rem",
  },
};
