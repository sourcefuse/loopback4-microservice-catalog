/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Typography } from "@mui/material";
import { VideoCall } from "../Components/VideoCall";
import { useSearchParams } from "react-router-dom";
import useConfig from "../Hooks/useConfig";

export const VideoCallPage = () => {
  const { vonageApiKey } = useConfig().config;

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const sessionId = searchParams.get("sessionId");

  if (!token || !sessionId || !vonageApiKey) {
    return <Typography> You have no video calls</Typography>;
  }

  return (
    <>
      <VideoCall
        sessionId={sessionId}
        token={token}
        vonageApiKey={vonageApiKey}
      />
    </>
  );
};
