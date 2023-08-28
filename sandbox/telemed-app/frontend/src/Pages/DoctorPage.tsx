/* eslint-disable @typescript-eslint/no-misused-promises */
import { Box, Chip, Divider, Grid, Paper, Typography } from "@mui/material";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import { NotificationList } from "../Components/Notification";
import useConfig from "../Hooks/useConfig";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArticleIcon from "@mui/icons-material/Article";
import BiotechIcon from "@mui/icons-material/Biotech";
import SummarizeIcon from "@mui/icons-material/Summarize";
import SideNav from "../Components/SideNav/SideNav";
import dayjs, { Dayjs } from "dayjs";
import Badge from "@mui/material/Badge";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton";

import { useCallback, useEffect, useRef, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import Button from "../Components/Button/Button";

const highlightBoxes = [
  {
    icon: <PeopleAltOutlinedIcon fontSize="large" />,
    label: "Consultations",
    metrics: "8/14",
  },
  {
    icon: <ArticleIcon fontSize="large" />,
    label: "Prescriptions",
    metrics: "12/29",
  },
  {
    icon: <BiotechIcon fontSize="large" />,
    label: "Tests",
    metrics: "4/20",
  },
  {
    icon: <SummarizeIcon fontSize="large" />,
    label: "Reports",
    metrics: "1/6",
  },
];

function getRandomNumber(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}
function fakeFetch(date: Dayjs, { signal }: { signal: AbortSignal }) {
  return new Promise<{ daysToHighlight: number[] }>((resolve, reject) => {
    const timeout = setTimeout(() => {
      const daysInMonth = date.daysInMonth();
      const daysToHighlight = [1, 2, 3, 4, 5, 6].map(() =>
        getRandomNumber(1, daysInMonth)
      );

      resolve({ daysToHighlight });
    }, 500);

    signal.onabort = () => {
      clearTimeout(timeout);
      reject(new DOMException("aborted", "AbortError"));
    };
  });
}

const initialValue = dayjs();

function ServerDay(
  props: PickersDayProps<Dayjs> & { highlightedDays?: number[] }
) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  const isSelected =
    !props.outsideCurrentMonth &&
    highlightedDays.indexOf(props.day.date()) >= 0;

  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      badgeContent={isSelected ? "✔" : undefined}
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
      />
    </Badge>
  );
}

export const DoctorPage = () => {
  const { notificationChannelUuid } = useConfig().config;

  const [open, setOpen] = useState(true);
  const toggleDrawer = useCallback(() => setOpen((prev) => !prev), []);
  const requestAbortController = useRef<AbortController | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedDays, setHighlightedDays] = useState<number[]>([]);

  const fetchHighlightedDays = (date: Dayjs) => {
    const controller = new AbortController();
    fakeFetch(date, {
      signal: controller.signal,
    })
      .then(({ daysToHighlight }) => {
        setHighlightedDays(daysToHighlight);
        setIsLoading(false);
      })
      .catch((error: { name: unknown }) => {
        // ignore the error if it's caused by `controller.abort`
        if (error.name !== "AbortError") {
          throw error;
        }
      });

    requestAbortController.current = controller;
  };

  useEffect(() => {
    fetchHighlightedDays(initialValue);
    // abort request on unmount
    return () => requestAbortController.current?.abort();
  }, []);

  const handleMonthChange = (date: Dayjs) => {
    if (requestAbortController.current) {
      // make sure that you are aborting useless requests
      // because it is possible to switch between months pretty quickly
      requestAbortController.current.abort();
    }

    setIsLoading(true);
    setHighlightedDays([]);
    fetchHighlightedDays(date);
  };

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
              padding: "1rem 4rem",
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
              Hi Doctor, You've <b>6</b> appointments remaining today!
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                justifyContent: "space-between",
                "& > :not(style)": {
                  m: 1,
                  width: 128,
                  height: 128,
                  justifySelf: "center",
                },
                marginBottom: "1rem",
              }}
            >
              {highlightBoxes.map((e) => {
                return (
                  <Paper
                    variant="outlined"
                    key={e.label}
                    sx={{
                      padding: "1rem",
                      display: "grid",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                      "& > *": {
                        textAlign: "center",
                        margin: "0 auto",
                      },
                    }}
                  >
                    {e.icon}
                    <Typography variant="h4">{e.metrics}</Typography>
                    <Typography variant="caption" color="grey">
                      {e.label}
                    </Typography>
                  </Paper>
                );
              })}
            </Box>
            <Grid container gap={2} justifyContent={"center"}>
              <Grid item xs={5}>
                {notificationChannelUuid ? (
                  <NotificationList
                    notificationChannelUuid={notificationChannelUuid}
                  />
                ) : null}
              </Grid>
              <Grid item xs={5}>
                <Paper
                  elevation={24}
                  sx={{ padding: "1rem", textAlign: "center" }}
                >
                  <Typography
                    variant="h5"
                    textAlign={"center"}
                    sx={{ padding: "1rem" }}
                  >
                    Your Calendar
                  </Typography>
                  <Divider />
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar
                      defaultValue={initialValue}
                      loading={isLoading}
                      onMonthChange={handleMonthChange}
                      renderLoading={() => <DayCalendarSkeleton />}
                      slots={{
                        day: ServerDay,
                      }}
                      slotProps={{
                        day: {
                          highlightedDays,
                        } as never,
                      }}
                    />
                    <Button variant="outlined">Book an Appointment</Button>
                  </LocalizationProvider>
                </Paper>
              </Grid>
            </Grid>
          </main>
        </Grid>
      </Grid>
    </>
  );
};
