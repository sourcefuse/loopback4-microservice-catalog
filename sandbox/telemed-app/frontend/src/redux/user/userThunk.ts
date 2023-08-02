import { createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "../auth/user.model";
import { RootState } from "../store";

export const fetchUserData = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>("user/fetchUser", async (_, { rejectWithValue, getState }) => {
  try {
    const rootState = getState() as RootState;
    const { accessToken } = rootState.auth;
    const configData = rootState.config.configData;
    const authBaseUrl = configData?.authApiBaseUrl || "";

    const response = await fetch(`${authBaseUrl}/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken!}`,
      },
    });
    return (await response.json()) as User;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});
