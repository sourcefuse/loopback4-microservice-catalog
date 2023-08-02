import { createAsyncThunk } from "@reduxjs/toolkit";

export interface Configuration {
  clientId: string;
  authApiBaseUrl: string;
  notificationApiBaseUrl: string;
  videoApiBaseUrl: string;
  pubnubPublishKey: string;
  pubnubSubscribeKey: string;
  notificationChannelUuid: string;
  chatChannelUuid: string;
  vonageApiKey: string;
}

export const fetchConfigData = createAsyncThunk<
  Configuration,
  void,
  { rejectValue: string }
>("config/fetchConfigData", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch("/config.json");
    return (await response.json()) as Configuration;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});
