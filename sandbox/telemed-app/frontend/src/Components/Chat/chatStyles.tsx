import { SxProps } from "@mui/material";

export const chatStyles = {
  container: {
    position: "relative",
    display: "grid",
    gridTemplateRows: "1fr 5fr 1fr",
    alignItems: "center",
    justifyContent: "center",
    height: "60vh",
    padding: "1rem",
    background: "white",
    borderRadius: "1.5rem 0 0 1.5rem",
  } as SxProps,
  messagesBody: {
    padding: "1rem 0",
    width: "100%",
    overflow: "auto",
    height: "calc( 100% - 80px )",
    background: "transparent",
  },
};
