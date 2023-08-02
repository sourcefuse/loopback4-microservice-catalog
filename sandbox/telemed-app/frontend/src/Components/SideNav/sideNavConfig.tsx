import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MedicationIcon from "@mui/icons-material/Medication";
import ForumIcon from "@mui/icons-material/Forum";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import HomeIcon from "@mui/icons-material/Home";
import BarChartIcon from "@mui/icons-material/BarChart";
import { ReactNode } from "react";

export type SideNavDividerType = {
  type: "divider";
  visible: boolean;
};

export type SideNavTitleType = {
  label: string;
  type: "title";
  visible: boolean;
};

export type SideNavLinkTitle = {
  label: string;
  visible: boolean;
  link: string;
  icon?: ReactNode;
  children?: (SideNavLinkTitle | SideNavTitleType)[];
};

export type SideNavConfig =
  | SideNavLinkTitle
  | SideNavDividerType
  | SideNavTitleType;

const sideNavConfig: SideNavConfig[] = [
  {
    label: "home",
    link: "/home",
    icon: <HomeIcon />,
    visible: true,
  },
  {
    label: "appointments",
    link: "/appointments",
    icon: <CalendarMonthIcon />,
    visible: true,
  },

  {
    label: "prescriptions",
    link: "/prescriptions",
    icon: <MedicationIcon />,
    visible: true,
  },
  {
    label: "messages",
    link: "/messages",
    icon: <ForumIcon />,
    visible: true,
  },
  {
    label: "Video Calls",
    link: "/videoCallHistory",
    icon: <VideoCallIcon />,
    visible: true,
  },
  {
    label: "statistics",
    link: "/statistics",
    icon: <BarChartIcon />,
    visible: true,
  },
];

export default sideNavConfig;
