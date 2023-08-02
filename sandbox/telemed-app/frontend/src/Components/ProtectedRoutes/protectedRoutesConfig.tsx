import { RouteObject } from "react-router-dom";
import { HomePage } from "../../Pages/HomePage";
import { VideoCallPage } from "../../Pages/VideoCallPage";
import { User } from "../../redux/auth/user.model";
import { AppointmentsPage } from "../../Pages/AppointmentsPage";
import { PrescriptionsPage } from "../../Pages/PrescriptionsPage";
import { MessagesPage } from "../../Pages/MessagesPage";
import { VideoCallsStaticPage } from "../../Pages/VideoCallsStaticPage";
import { StatisticsPage } from "../../Pages/StatisticsPage";

export const getProtectedRoutesConfig = (user: User): RouteObject[] => {
  return [
    {
      path: "/home",
      element: <HomePage role={user.role} />,
    },
    {
      path: "/videoCall",
      element: <VideoCallPage />,
    },
    {
      path: "/appointments",
      element: <AppointmentsPage />,
    },
    {
      path: "/prescriptions",
      element: <PrescriptionsPage />,
    },
    {
      path: "/messages",
      element: <MessagesPage />,
    },
    {
      path: "/videoCallHistory",
      element: <VideoCallsStaticPage />,
    },
    {
      path: "/statistics",
      element: <StatisticsPage />,
    },
  ];
};
