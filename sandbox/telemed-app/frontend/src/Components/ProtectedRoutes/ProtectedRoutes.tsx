import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useEffect, useState } from "react";
import { fetchUserData } from "../../redux/user/userThunk";
import useAuth from "../../Hooks/useAuth";
import { selectCurrentUser } from "../../redux/user/userSlice";
import BackdropLoader from "../BackdropLoader";
import { getProtectedRoutesConfig } from "./protectedRoutesConfig";
import useConfig from "../../Hooks/useConfig";
import { PubNubProvider } from "pubnub-react";
import Pubnub from "pubnub";
import { NotFoundPage } from "../../Pages/NotFoundPage";

export const ProtectedRoutes = () => {
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  const { pubnubPublishKey, pubnubSubscribeKey } = useConfig().config;
  const userData = useAppSelector(selectCurrentUser);

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (isLoggedIn) {
        await dispatch(fetchUserData());
        setLoading(false);
      }
    };

    void fetchData();
  }, [dispatch, isLoggedIn]);

  if (isLoggedIn && loading) {
    return <BackdropLoader />;
  }

  return isLoggedIn && userData ? (
    <PubNubProvider
      client={
        new Pubnub({
          publishKey: pubnubPublishKey,
          subscribeKey: pubnubSubscribeKey,
          userId: userData.id,
        })
      }
    >
      <Routes>
        {getProtectedRoutesConfig(userData).map(({ path, element }, index) => (
          <Route path={path} element={element} key={`protected-${index}`} />
        ))}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </PubNubProvider>
  ) : (
    <Navigate to={"/login"} state={{ from: location }} replace />
  );
};
