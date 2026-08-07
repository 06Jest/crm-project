import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import type {
  Subscription,
  SubscriptionState,
  CreateSubscriptionDTO,
} from "../types/subscription";

import {
  createFreeSubscriptionAPI,
  fetchSubscriptionAPI,
  updateSubscriptionPlanAPI,
  updateSubscriptionStatusAPI,
} from "../services/subscriptionService";

const initialState: SubscriptionState = {
  subscription: null,
  loading: false,
  loaded: false,
  error: null,
};

export const fetchSubscription = createAsyncThunk(
  "subscription/fetch",
  async (_, thunkAPI) => {
    try {
      return await fetchSubscriptionAPI();
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to fetch subscription"
      );
    }
  }
);

export const createFreeSubscription = createAsyncThunk(
  "subscription/create",
  async (
    subscription: CreateSubscriptionDTO,
    thunkAPI
  ) => {
    try {
      return await createFreeSubscriptionAPI(
        subscription
      );
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to create subscription"
      );
    }
  }
);

export const updateSubscriptionPlan = createAsyncThunk(
  "subscription/update-plan",
  async (
    plan: Pick<Subscription, "plan">,
    thunkAPI
  ) => {
    try {
      return await updateSubscriptionPlanAPI(
        plan
      );
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to update subscription plan"
      );
    }
  }
);

export const updateSubscriptionStatus = createAsyncThunk(
  "subscription/update-status",
  async (
    status: Pick<Subscription, "status">,
    thunkAPI
  ) => {
    try {
      return await updateSubscriptionStatusAPI(
        status
      );
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to update subscription status"
      );
    }
  }
);

const subscriptionSlice = createSlice({

  name: "subscription",

  initialState,

  reducers: {

    clearError(state) {
      state.error = null;
    },

    clearSubscription(state) {
      state.subscription = null;
      state.loaded = false;
    },

  },

  extraReducers: (builder) => {

    builder
      .addCase(fetchSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.subscription = action.payload;
      })
      .addCase(fetchSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(createFreeSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFreeSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.subscription = action.payload;
      })
      .addCase(createFreeSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(updateSubscriptionPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.subscription = action.payload;
      })
      .addCase(updateSubscriptionPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(updateSubscriptionStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.subscription = action.payload;
      })
      .addCase(updateSubscriptionStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

  },

});

export const {
  clearError,
  clearSubscription,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;