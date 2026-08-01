import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import type {
  ActivitiesState,
  ManualCreateActivity,
  UpdateActivity,
  ActivityAction,
  ActivityType,
} from "../types/activity";

import {
  fetchActivitiesAPI,
  fetchActivityByIDAPI,
  fetchLeadActivitiesAPI,
  fetchContactActivitiesAPI,
  fetchCustomerActivitiesAPI,
  fetchActivitiesByActionAPI,
  fetchActivitiesByTypeAPI,
  addManualActivityAPI,
  updateActivityAPI,
} from "../services/activityService";

const initialState: ActivitiesState = {
  items: [],
  loading: false,
  loaded: false,
  error: null,
};

export const fetchActivities = createAsyncThunk(
  "activities/show-activities",
  async (_, thunkAPI) => {
    try {
      return await fetchActivitiesAPI();
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to fetch activities"
      );
    }
  }
);

export const fetchActivityByID = createAsyncThunk(
  "activities/show-activity",
  async (id: string, thunkAPI) => {
    try {
      return await fetchActivityByIDAPI(id);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to fetch activity"
      );
    }
  }
);

export const fetchLeadActivities = createAsyncThunk(
  "activities/show-lead-activities",
  async (leadId: string, thunkAPI) => {
    try {
      return await fetchLeadActivitiesAPI(leadId);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to fetch activities"
      );
    }
  }
);

export const fetchContactActivities = createAsyncThunk(
  "activities/show-contact-activities",
  async (contactId: string, thunkAPI) => {
    try {
      return await fetchContactActivitiesAPI(contactId);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to fetch activities"
      );
    }
  }
);

export const fetchCustomerActivities = createAsyncThunk(
  "activities/show-customer-activities",
  async (customerId: string, thunkAPI) => {
    try {
      return await fetchCustomerActivitiesAPI(customerId);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to fetch activities"
      );
    }
  }
);

export const fetchActivitiesByAction = createAsyncThunk(
  "activities/show-activities-action",
  async (action: ActivityAction, thunkAPI) => {
    try {
      return await fetchActivitiesByActionAPI(action);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to fetch activities"
      );
    }
  }
);

export const fetchActivitiesByType = createAsyncThunk(
  "activities/show-activities-type",
  async (type: ActivityType, thunkAPI) => {
    try {
      return await fetchActivitiesByTypeAPI(type);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to fetch activities"
      );
    }
  }
);

export const addManualActivity = createAsyncThunk(
  "activities/add-manual-activity",
  async (
    activity: ManualCreateActivity,
    thunkAPI
  ) => {
    try {
      return await addManualActivityAPI(activity);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Something went wrong"
      );
    }
  }
);

export const updateActivity = createAsyncThunk(
  "activities/update-activity",
  async (
    {
      id,
      activity,
    }: {
      id: string;
      activity: UpdateActivity;
    },
    thunkAPI
  ) => {
    try {
      return await updateActivityAPI(
        id,
        activity
      );
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Something went wrong"
      );
    }
  }
);

const activitiesSlice = createSlice({
  name: "activities",

  initialState,

  reducers: {
    clearError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchActivities.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchActivities.fulfilled, (state, action) => {
      state.loading = false;
      state.loaded = true;
      state.items = action.payload;
    });

    builder.addCase(fetchActivities.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(addManualActivity.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(addManualActivity.fulfilled, (state, action) => {
      state.items.unshift(action.payload);
      state.loading = false;
    });

    builder.addCase(updateActivity.fulfilled, (state, action) => {
      const index =
        state.items.findIndex(
          a => a.id === action.payload.id
        );

      if (index !== -1) {
        state.items[index] = action.payload;
      }

      state.loading = false;
    });

    builder.addCase(fetchActivityByID.fulfilled, (state, action) => {
      const index =
        state.items.findIndex(
          a => a.id === action.payload.id
        );

      if (index !== -1) {
        state.items[index] = action.payload;
      } else {
        state.items.unshift(action.payload);
      }

      state.loading = false;
    });

    builder.addCase(fetchLeadActivities.fulfilled, (state, action) => {
      state.items = action.payload;
      state.loading = false;
    });

    builder.addCase(fetchContactActivities.fulfilled, (state, action) => {
      state.items = action.payload;
      state.loading = false;
    });

    builder.addCase(fetchCustomerActivities.fulfilled, (state, action) => {
      state.items = action.payload;
      state.loading = false;
    });

    builder.addCase(fetchActivitiesByAction.fulfilled, (state, action) => {
      state.items = action.payload;
      state.loading = false;
    });

    builder.addCase(fetchActivitiesByType.fulfilled, (state, action) => {
      state.items = action.payload;
      state.loading = false;
    });

    builder.addCase(addManualActivity.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(updateActivity.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(fetchActivityByID.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(fetchLeadActivities.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(fetchContactActivities.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(fetchCustomerActivities.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(fetchActivitiesByAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(fetchActivitiesByType.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const {
  clearError,
} = activitiesSlice.actions;

export default activitiesSlice.reducer;