import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AuthData, resetAuthState, setCredentials } from "./auth/authSlice";
import type { RootState } from "./store";
import { clearUser } from "./user/userSlice";

/**
 * Base query function with re-Authentication handling and header preparation.
 * This function serves as an interceptor for API requests.
 *
 * @param args - The fetch arguments for the request.
 * @param api - The API object provided by `createApi`.
 * @param extraOptions - Extra options for the query.
 */
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const baseUrl = (api.getState() as RootState).config.configData
    ?.authApiBaseUrl;

  const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders(headers, { getState }) {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // try to get a new token
    console.debug("sending refresh token....");
    const refreshResult = await baseQuery(
      {
        url: "/auth/token-refresh",
        method: "POST",
        body: { refreshToken: (api.getState() as RootState).auth.refreshToken },
      },
      api,
      extraOptions
    );
    if (refreshResult.data) {
      // store the new token
      api.dispatch(setCredentials(refreshResult.data as AuthData));
      // retry the initial query
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(resetAuthState());
      api.dispatch(clearUser());
    }
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});
