import { useEffect, useState } from "react";
import AppRoutes from "./Routes/Routes";
import { getRouteConfig } from "./Routes/routesConfig";
import { useAppDispatch } from "./redux/hooks";
import { fetchConfigData } from "./redux/config/configThunk";
import useConfig from "./Hooks/useConfig";
import BackdropLoader from "./Components/BackdropLoader/BackdropLoader";

function App() {
  const dispatch = useAppDispatch();
  const configData = useConfig().config;

  console.debug("Config Data: ", configData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dispatchThunk = async () => {
      await dispatch(fetchConfigData()).unwrap();
      setLoading(false);
    };
    void dispatchThunk();
  }, [dispatch]);

  if (loading) {
    return <BackdropLoader />;
  }

  return (
    <>
      <AppRoutes routesConfig={getRouteConfig()} />
    </>
  );
}

export default App;
