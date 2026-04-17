import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Activity } from '../types/activity';
import {
  fetchActivitiesFromDB,
  addActivityToDB,
  updateActivityInDB,
  deleteActivityFromDB,
  toggleActivityCompleteInDB,
} from '../services/activityService';

interface ActivitiesState {
  items: Activity[];
  loading: boolean;
  error: string | null;
}

const initialState: ActivitiesState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchActivities = createAsyncThunk(
  'activities/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchActivitiesFromDB();
    } catch (err: unknown) {
      if (err instanceof Error) return rejectWithValue (err.message);;
      return rejectWithValue('Something went wrong');
    }
  }
);

export const addActivity = createAsyncThunk(
  'activities/add',
  async (
    activity: Omit<Activity, 'id' | 'created_at'>,
    { rejectWithValue }
  ) => {
    try {
      return await addActivityToDB(activity);
    } catch (err: unknown) {
      if (err instanceof Error) return rejectWithValue(err.message);
      return rejectWithValue('Something went wrong');
    }
  }
);

export const updateActivity = createAsyncThunk(
  'activities/update',
  async (activity: Activity, { rejectWithValue }) => {
    try {
      return await updateActivityInDB(activity);
    } catch (err: unknown) {
      if (err instanceof Error) return rejectWithValue(err.message);
      return rejectWithValue('Something went wrong');
    }
  }
);

export const deleteActivity = createAsyncThunk(
  'activities/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      return await deleteActivityFromDB(id);
    } catch (err: unknown) {
      if (err instanceof Error) return rejectWithValue(err.message);
      return rejectWithValue('Something went wrong');
    }
  }
);

export const toggleActivityComplete = createAsyncThunk(
  'activities/toggleComplete',
  async (
    { id, completed }: { id: string; completed: boolean },
    { rejectWithValue }
  ) => {
    try {
      return await toggleActivityCompleteInDB(id, completed);
    } catch (err: unknown) {
      if (err instanceof Error) return rejectWithValue(err.message);
      return rejectWithValue('Something went wrong');
    }
  }
);

const activitiesSlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {},
  extraReducers: (builder) => {


    builder.addCase(fetchActivities.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchActivities.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
    });
    builder.addCase(fetchActivities.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });


    builder.addCase(addActivity.fulfilled, (state, action) => {
      state.items.unshift(action.payload);
    });
    builder.addCase(addActivity.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    builder.addCase(updateActivity.fulfilled, (state, action) => {
      const index = state.items.findIndex(
        (a) => a.id === action.payload.id
      );
      if (index !== -1) state.items[index] = action.payload;
    });
    builder.addCase(updateActivity.rejected, (state, action) => {
      state.error = action.payload as string;
    });


    builder.addCase(deleteActivity.fulfilled, (state, action) => {
      state.items = state.items.filter((a) => a.id !== action.payload);
    });
    builder.addCase(deleteActivity.rejected, (state, action) => {
      state.error = action.payload as string;
    });

   
    builder.addCase(toggleActivityComplete.fulfilled, (state, action) => {
      const index = state.items.findIndex(
        (a) => a.id === action.payload.id
      );
      if (index !== -1) state.items[index] = action.payload;
    });
  },
});

export default activitiesSlice.reducer;