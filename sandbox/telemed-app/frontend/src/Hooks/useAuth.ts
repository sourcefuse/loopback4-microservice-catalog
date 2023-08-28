/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSnackbar } from "notistack";
import useConfig from "./useConfig";
import {
  useLoginMutation,
  useLogoutMutation,
} from "../redux/auth/authApiSlice";
import type { LoginForm } from "../redux/auth/authApiSlice";
import {
  resetAuthState,
  selectCurrentAuthState,
  selectCurrentLoginStatus,
  selectCurrentRefreshToken,
  setCredentials,
} from "../redux/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { clearUser } from "../redux/user/userSlice";

/**
 * Custom hook for handling authentication-related functionality.
 * Manages login, logout, and provides necessary data and loading states.
 */
export default function useAuth() {
  const {
    config: { clientId },
  } = useConfig();

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useAppDispatch();
  const [loginApi, { isLoading: loginLoading }] = useLoginMutation();
  const [logoutApi, { isLoading: logoutLoading }] = useLogoutMutation();

  const refreshToken = useAppSelector(selectCurrentRefreshToken);
  const isLoggedIn = useAppSelector(selectCurrentLoginStatus);
  const authData = useAppSelector(selectCurrentAuthState);

  /**
   * Performs login with the provided login form values.
   * @param values - credentials.
   */
  const login = async (values: LoginForm) => {
    try {
      const response = await loginApi({
        client_id: clientId,
        ...values,
      }).unwrap();
      dispatch(setCredentials(response));
      enqueueSnackbar("Login Successful", { variant: "success" });
    } catch (err: any) {
      enqueueSnackbar(`${err.status}: ${err.data.error.name}`, {
        variant: "error",
      });
    }
  };

  /**
   * Performs logout by making a request to the logout API endpoint and clearing storages.
   */
  const logout = async () => {
    try {
      await logoutApi(refreshToken).unwrap();
      dispatch(resetAuthState());
      dispatch(clearUser());
    } catch (err) {
      console.error(err);
    }
  };

  return {
    isLoggedIn,
    login,
    authData,
    logout,
    loginLoading,
    logoutLoading,
  };
}
