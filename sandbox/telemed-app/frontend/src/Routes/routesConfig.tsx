import { Navigate, RouteObject } from "react-router-dom";
import Login from "../Pages/Login";
import { ProtectedRoutes } from "../Components/ProtectedRoutes";
import { SideNavPage } from "../Pages/SideNavPage";

export const getRouteConfig = (): RouteObject[] => {
  return [
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/",
      element: <Navigate to={"/home"} replace />,
    },
    {
      path: "/sidenav",
      element: <SideNavPage />,
    },
    {
      path: "/*",
      element: <ProtectedRoutes />,
    },
  ];
};
