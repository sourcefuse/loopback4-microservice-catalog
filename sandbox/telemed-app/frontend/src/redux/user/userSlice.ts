import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { fetchUserData } from "./userThunk"; // Import the fetchConfigData thunk
import { User } from "../auth/user.model";
import { RootState } from "../store";

interface UserState {
  data: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  data: null,
  isLoading: false,
  error: null,
};

// Create the userSlice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.data = action.payload;
    },
    clearUser: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserData.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });

    builder.addCase(fetchUserData.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
      state.error = null;
    });

    builder.addCase(fetchUserData.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export default userSlice.reducer;

//Actions
export const { setUser, clearUser } = userSlice.actions;

// Selectors
export const selectCurrentUser = (state: RootState) => state.user.data;
