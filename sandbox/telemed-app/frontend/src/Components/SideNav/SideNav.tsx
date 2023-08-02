/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Box, Button } from "@mui/material";
import List from "@mui/material/List";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Toolbar from "@mui/material/Toolbar";
import arcLogo from "../../Assets/ARC_logo.png";
import React from "react";
import { useLocation } from "react-router-dom";
import sideNavConfig from "./sideNavConfig";
import SideNavLink from "./SideNavLink";
import LogoutIcon from "@mui/icons-material/Logout";
import useAuth from "../../Hooks/useAuth";

interface Props {
  isPermanent: boolean;
  open: boolean;
  drawerWidth: number | string;
  toggleDrawer: any;
  isAppBarFullWidth: boolean;
}

const SideNav: React.FC<Props> = ({
  isPermanent,
  drawerWidth,
  toggleDrawer,
  open,
  isAppBarFullWidth,
}) => {
  const location = useLocation();
  const { logout, logoutLoading } = useAuth();

  const handleLogout = () => {
    logout().finally(() => {
      console.debug("Logged out");
    });
  };
  return (
    <SwipeableDrawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        height: "100%",
        "& .MuiDrawer-paper": {
          position: "relative",
          height: "100%",
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "background.default",
        },
      }}
      variant={isPermanent ? "persistent" : "temporary"}
      anchor="left"
      open={open}
      ModalProps={{
        onClose: toggleDrawer,
      }}
      onOpen={toggleDrawer}
      onClose={toggleDrawer}
      data-testid="sidenav"
    >
      {(isAppBarFullWidth || !isPermanent) && (
        <>
          <Toolbar />
          <Toolbar />
        </>
      )}
      <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
        <img src={arcLogo} width="100px" alt="logo" />
      </Box>
      <List
        sx={{
          flexDirection: "column",
          flexGrow: 1,
        }}
      >
        {sideNavConfig.map((sideNavConfigItem, index) => (
          <SideNavLink
            key={`menu-${index}`}
            location={location}
            {...sideNavConfigItem}
          />
        ))}
      </List>
      <Button
        onClick={handleLogout}
        startIcon={<LogoutIcon />}
        sx={{
          marginBottom: "50px",
        }}
        disabled={logoutLoading}
      >
        {logoutLoading ? "Logging out..." : "Logout"}
      </Button>
    </SwipeableDrawer>
  );
};
export default SideNav;
