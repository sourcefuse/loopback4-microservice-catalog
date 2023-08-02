/* eslint-disable @typescript-eslint/no-unused-vars */
import { Middleware } from "@reduxjs/toolkit";

const storageMiddleware: Middleware = () => (next) => (action) => {
  if (action.type === "auth/setCredentials") {
    const { accessToken, refreshToken, expires } = action.payload;

    // Update localStorage
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("expires", expires?.toString());
  }

  if (action.type === "auth/resetAuthState") {
    localStorage.clear();
    sessionStorage.clear();
  }

  // Pass the action to the next middleware or reducer
  return next(action);
};

export default storageMiddleware;
