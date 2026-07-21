import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { ProfileState } from '../types/profile';
import { fetchMembersIDNamesAPI } from '../services/profileService';

const initialState: ProfileState = {
  items: [],
  loading: false,
  loaded: false,
  error: null,
};

export const fetchMembersIDNames = createAsyncThunk(
  'deals/fetchAll',
  async (_, thunkAPI) => {
    try {
      return await fetchMembersIDNamesAPI();
    }  catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      };
       return thunkAPI
          .rejectWithValue(
            'Failed to fetch deals'
          );  
    }
  }
);


const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchMembersIDNames.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchMembersIDNames.fulfilled, (state, action) => {
      state.loading = false;
      state.loaded = true;
      state.items = action.payload;
    });

    builder.addCase(fetchMembersIDNames.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
  },
});

export default profileSlice.reducer;