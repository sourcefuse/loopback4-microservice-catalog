import { useCallback, useState } from "react";
import SideNav from "../Components/SideNav/SideNav";

export const SideNavPage = () => {
  const [open, setOpen] = useState(true);
  const toggleDrawer = useCallback(() => setOpen((prev) => !prev), []);

  return (
    <SideNav
      isPermanent={true}
      isAppBarFullWidth={false}
      drawerWidth={270}
      toggleDrawer={toggleDrawer}
      open={open}
    />
  );
};
