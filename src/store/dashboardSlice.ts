import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type { DashboardData } from "../types/dashboard";

import { fetchDashboardAPI } from "../services/dashboardService";

interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchDashboard = createAsyncThunk<
  DashboardData,
  void,
  { rejectValue: string }
>("dashboard/fetch", async (_, thunkAPI) => {
  try {
    return await fetchDashboardAPI();
  } catch (err) {
    if (err instanceof Error) {
      return thunkAPI.rejectWithValue(err.message);
    }

    return thunkAPI.rejectWithValue("Failed to fetch dashboard");
  }
});

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,

  reducers: {
    clearError(state) {
      state.error = null;
    },

    clearDashboard(state) {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchDashboard.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchDashboard.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });

    builder.addCase(fetchDashboard.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.payload ?? "Failed to fetch dashboard";
    });
  },
});

export const {
  clearError,
  clearDashboard,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;