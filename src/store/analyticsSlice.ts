import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type {
  AnalyticsData,
  AnalyticsFilters,
} from "../types/analytics";

import { fetchAnalyticsAPI } from "../services/analyticsService";

interface AnalyticsState {
  data: AnalyticsData | null;
  loading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchAnalytics = createAsyncThunk<
  AnalyticsData,
  AnalyticsFilters,
  { rejectValue: string }
>("analytics/fetch", async (filters, thunkAPI) => {
  try {
    return await fetchAnalyticsAPI(filters);
  } catch (err) {
    if (err instanceof Error) {
      return thunkAPI.rejectWithValue(err.message);
    }

    return thunkAPI.rejectWithValue("Failed to fetch analytics");
  }
});

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,

  reducers: {
    clearError(state) {
      state.error = null;
    },

    clearAnalytics(state) {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchAnalytics.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchAnalytics.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });

    builder.addCase(fetchAnalytics.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.payload ?? "Failed to fetch analytics";
    });
  },
});

export const {
  clearError,
  clearAnalytics,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;