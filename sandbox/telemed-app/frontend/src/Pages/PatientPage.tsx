/* eslint-disable @typescript-eslint/no-misused-promises */
import Button from "../Components/Button";
import { Grid, Typography } from "@mui/material";
import { useBookConsultation } from "../Hooks/useBookConsultation";
import { useNavigate } from "react-router";
import { useCallback, useEffect, useState } from "react";
import patientDashBg from "./../Assets/patient-dash.png";
import { createSearchParams } from "react-router-dom";
import MedicalIcons from "@mui/icons-material/MedicalInformation";
import SideNav from "../Components/SideNav/SideNav";

export const PatientPage = () => {
  const navigate = useNavigate();
  const {
    meetingLink,
    handleBookConsultation,
    sessionId,
    token,
    loading: bookingConsultationInProgress,
  } = useBookConsultation();

  useEffect(() => {
    if (!bookingConsultationInProgress && meetingLink && sessionId && token) {
      navigate({
        pathname: "/videoCall",
        search: createSearchParams({ token, sessionId }).toString(),
      });
    }
  }, [bookingConsultationInProgress, meetingLink, navigate, sessionId, token]);

  const [open, setOpen] = useState(true);
  const toggleDrawer = useCallback(() => setOpen((prev) => !prev), []);

  return (
    <>
      {/* <AppBar /> */}
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
              alignItems: "center",
              textAlign: "center",
              flexDirection: "column",
              height: "100%",
              backgroundImage: `url(${patientDashBg})`,
              backgroundSize: "cover",
              backgroundPosition: "top",
            }}
          >
            <div
              style={{
                padding: "1.5rem",
                paddingTop: "4rem",
              }}
            >
              <Typography variant="h2">
                Virtual Healthcare & Prescriptions
              </Typography>

              <Typography
                variant="h4"
                style={{
                  paddingTop: "1rem",
                  fontWeight: "lighter",
                }}
              >
                We've over 2000+ Doctors Available
              </Typography>
            </div>
            <div
              style={{
                padding: "3rem",
              }}
            >
              <Button
                startIcon={<MedicalIcons />}
                variant="contained"
                color="error"
                children="Consult Now"
                onClick={handleBookConsultation}
                size="large"
                sx={{ marginTop: 2 }}
                style={{
                  transform: "scale(1.2)",
                }}
                isLoading={bookingConsultationInProgress}
              />
            </div>
          </main>
        </Grid>
      </Grid>
    </>
  );
};
