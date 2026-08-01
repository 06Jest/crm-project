import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import type {
  DashboardState,
  TrendInterval,
} from "../types/dashboard";

import {
  fetchDashboardOverviewAPI,
  fetchLeadMetricsAPI,
  fetchDealMetricsAPI,
  fetchCustomerMetricsAPI,
  fetchActivityMetricsAPI,
  fetchDashboardTrendsAPI,
  fetchRecentDashboardActivitiesAPI,
  fetchUserPerformanceMetricsAPI,
} from "../services//dashboardService";

const initialState: DashboardState = {
  overview: null,
  leadMetrics: null,
  dealMetrics: null,
  customerMetrics: null,
  activityMetrics: null,
  trends: null,
  recentActivities: [],
  userPerformance: null,

  loading: {
    overview: false,
    leads: false,
    deals: false,
    customers: false,
    activity: false,
    trends: false,
    recentActivities: false,
    performance: false,
  },
  loaded: false,
  error: null,
};

export const fetchDashboardOverview = createAsyncThunk(
  "dashboard/fetch-overview",
  async (_, thunkAPI) => {
    try {
      return await fetchDashboardOverviewAPI();
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to fetch dashboard overview"
      );
    }
  }
);

export const fetchLeadMetrics = createAsyncThunk(
  "dashboard/fetch-lead-metrics",
  async (_, thunkAPI) => {
    try {
      return await fetchLeadMetricsAPI();
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to fetch lead metrics"
      );
    }
  }
);

export const fetchDealMetrics = createAsyncThunk(
  "dashboard/fetch-deal-metrics",
  async (_, thunkAPI) => {
    try {
      return await fetchDealMetricsAPI();
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to fetch deal metrics"
      );
    }
  }
);

export const fetchCustomerMetrics = createAsyncThunk(
  "dashboard/fetch-customer-metrics",
  async (_, thunkAPI) => {
    try {
      return await fetchCustomerMetricsAPI();
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to fetch customer metrics"
      );
    }
  }
);

export const fetchActivityMetrics = createAsyncThunk(
  "dashboard/fetch-activity-metrics",
  async (_, thunkAPI) => {
    try {
      return await fetchActivityMetricsAPI();
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to fetch activity metrics"
      );
    }
  }
);

export const fetchDashboardTrends = createAsyncThunk(
  "dashboard/fetch-trends",
  async (
    params: { interval?: TrendInterval; daysBack?: number } | undefined,
    thunkAPI
  ) => {
    try {
      return await fetchDashboardTrendsAPI(
        params?.interval,
        params?.daysBack
      );
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to fetch dashboard trends"
      );
    }
  }
);

export const fetchRecentDashboardActivities = createAsyncThunk(
  "dashboard/fetch-recent-activities",
  async (limit: number | undefined, thunkAPI) => {
    try {
      return await fetchRecentDashboardActivitiesAPI(limit);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to fetch recent activities"
      );
    }
  }
);

export const fetchUserPerformanceMetrics = createAsyncThunk(
  "dashboard/fetch-user-performance",
  async (_, thunkAPI) => {
    try {
      return await fetchUserPerformanceMetricsAPI();
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to fetch user performance metrics"
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,

  reducers: {
    clearError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // Overview
    builder.addCase(fetchDashboardOverview.pending, (state) => {
      state.loading.overview = true;
      state.error = null;
    });

    builder.addCase(fetchDashboardOverview.fulfilled, (state, action) => {
      state.loading.overview = false;
      state.loaded = true;
      state.overview = action.payload;
    });

    builder.addCase(fetchDashboardOverview.rejected, (state, action) => {
      state.loading.overview = false;
      state.error = action.payload as string;
    });

    // Lead metrics
    builder.addCase(fetchLeadMetrics.pending, (state) => {
      state.loading.leads = true;
      state.error = null;
    });

    builder.addCase(fetchLeadMetrics.fulfilled, (state, action) => {
      state.loading.leads = false;
      state.leadMetrics = action.payload;
    });

    builder.addCase(fetchLeadMetrics.rejected, (state, action) => {
      state.loading.leads = false;
      state.error = action.payload as string;
    });

    // Deal metrics
    builder.addCase(fetchDealMetrics.pending, (state) => {
      state.loading.deals = true;
      state.error = null;
    });

    builder.addCase(fetchDealMetrics.fulfilled, (state, action) => {
      state.loading.deals = false;
      state.dealMetrics = action.payload;
    });

    builder.addCase(fetchDealMetrics.rejected, (state, action) => {
      state.loading.deals = false;
      state.error = action.payload as string;
    });

    // Customer metrics
    builder.addCase(fetchCustomerMetrics.pending, (state) => {
      state.loading.customers = true;
      state.error = null;
    });

    builder.addCase(fetchCustomerMetrics.fulfilled, (state, action) => {
      state.loading.customers = false;
      state.customerMetrics = action.payload;
    });

    builder.addCase(fetchCustomerMetrics.rejected, (state, action) => {
      state.loading.customers = false;
      state.error = action.payload as string;
    });

    // Activity metrics
    builder.addCase(fetchActivityMetrics.pending, (state) => {
      state.loading.activity = true;
      state.error = null;
    });

    builder.addCase(fetchActivityMetrics.fulfilled, (state, action) => {
      state.loading.activity = false;
      state.activityMetrics = action.payload;
    });

    builder.addCase(fetchActivityMetrics.rejected, (state, action) => {
      state.loading.activity = false;
      state.error = action.payload as string;
    });

    // Trends
    builder.addCase(fetchDashboardTrends.pending, (state) => {
      state.loading.trends = true;
      state.error = null;
    });

    builder.addCase(fetchDashboardTrends.fulfilled, (state, action) => {
      state.loading.trends = false;
      state.trends = action.payload;
    });

    builder.addCase(fetchDashboardTrends.rejected, (state, action) => {
      state.loading.trends = false;
      state.error = action.payload as string;
    });

    // Recent activities
    builder.addCase(fetchRecentDashboardActivities.pending, (state) => {
      state.loading.recentActivities = true;
      state.error = null;
    });

    builder.addCase(
      fetchRecentDashboardActivities.fulfilled,
      (state, action) => {
        state.loading.recentActivities = false;
        state.recentActivities = action.payload;
      }
    );

    builder.addCase(
      fetchRecentDashboardActivities.rejected,
      (state, action) => {
        state.loading.recentActivities = false;
        state.error = action.payload as string;
      }
    );

    // User performance
    builder.addCase(fetchUserPerformanceMetrics.pending, (state) => {
      state.loading.performance = true;
      state.error = null;
    });

    builder.addCase(
      fetchUserPerformanceMetrics.fulfilled,
      (state, action) => {
        state.loading.performance = false;
        state.userPerformance = action.payload;
      }
    );

    builder.addCase(
      fetchUserPerformanceMetrics.rejected,
      (state, action) => {
        state.loading.performance = false;
        state.error = action.payload as string;
      }
    );
  },
});

export const { clearError } = dashboardSlice.actions;

export default dashboardSlice.reducer;