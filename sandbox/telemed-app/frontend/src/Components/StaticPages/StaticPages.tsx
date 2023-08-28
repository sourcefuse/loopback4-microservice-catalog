import { useCallback, useState } from "react";
import { Box, Chip, Grid, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import SideNav from "../SideNav/SideNav";

export interface StaticPagesProps {
  content: string;
  children?: React.ReactNode;
}

export const StaticPages: React.FC<StaticPagesProps> = ({
  content,
  children,
}) => {
  const [open, setOpen] = useState(true);
  const toggleDrawer = useCallback(() => setOpen((prev) => !prev), []);

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
          <main
            style={{
              display: "flex",
              justifyContent: "start",
              flexDirection: "column",
              height: "100%",
              backgroundColor: "#F3F6F9",
              padding: "1rem",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: "1rem",
              }}
            >
              <Chip
                icon={<CalendarMonth />}
                label={new Date().toDateString()}
                variant="outlined"
                color="default"
              />
              <Chip
                icon={<AccessTimeIcon />}
                label={new Date().toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                variant="outlined"
                color="default"
              />
            </Box>
            <Typography
              variant="h5"
              textAlign={"center"}
              sx={{ margin: "2rem 0", fontWeight: "lighter" }}
            >
              {content}
            </Typography>
            {children ? children : null}
          </main>
        </Grid>
      </Grid>
    </>
  );
};
