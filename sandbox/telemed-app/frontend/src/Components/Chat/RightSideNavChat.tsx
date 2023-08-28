import { Divider, Drawer, Toolbar } from "@mui/material";
import useConfig from "../../Hooks/useConfig";
import { Chat } from "./Chat";

const drawerWidth = 450;

export const RightSideNavChat = () => {
  const { chatChannelUuid } = useConfig().config;

  return (
    <>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="right"
      >
        <Toolbar />
        <Divider />
        {chatChannelUuid ? <Chat chatChannelUuid={chatChannelUuid} /> : null}
      </Drawer>
    </>
  );
};
