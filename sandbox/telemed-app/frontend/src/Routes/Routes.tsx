import { Suspense } from "react";
import { RouteObject, useRoutes } from "react-router-dom";
import BackdropLoader from "../Components/BackdropLoader";

interface RoutesProps {
  routesConfig: RouteObject[];
}

const Routes: React.FC<RoutesProps> = ({ routesConfig }) => {
  const routes = useRoutes(routesConfig);
  return <Suspense fallback={<BackdropLoader />}>{routes}</Suspense>;
};

export default Routes;
