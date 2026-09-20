import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import type {
  ArchiveListQuery,
  ArchiveType,
  ArchiveEntityFilter,
  ArchiveState,
} from '../types/archive';

import {
  fetchArchivesAPI,
  restoreRecordAPI
} from '../services/archiveService';


const initialState: ArchiveState = {
  items: [],
  type: 'archived',
  entity: 'all',
  search: '',
  page: 1,
  limit: 25,
  loading: false,
  loaded: false,
  error: null,
};


export const fetchArchives = createAsyncThunk(
  'archives/show',
  async (query: ArchiveListQuery, thunkAPI) => {
    try {
      return await fetchArchivesAPI(query);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        'Failed to fetch archives'
      );
    }
  }
);


export const restoreRecord = createAsyncThunk(
  "archives/restore",
  async (
    {
      entity,
      id,
      type,
    }: {
      entity: string;
      id: string;
      type: "archived" | "deleted";
    },
    thunkAPI
  ) => {
    try {
      return await restoreRecordAPI(entity, id, type);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to restore record"
      );
    }
  }
);


const archiveSlice = createSlice({
  name: 'archives',

  initialState,

  reducers: {
    setArchiveType: (
      state,
      action: {
        payload: ArchiveType;
      }
    ) => {
      state.type = action.payload;
      state.page = 1;
    },

    setArchiveEntity: (
      state,
      action: {
        payload: ArchiveEntityFilter;
      }
    ) => {
      state.entity = action.payload;
      state.page = 1;
    },

    setArchiveSearch: (
      state,
      action: {
        payload: string;
      }
    ) => {
      state.search = action.payload;
      state.page = 1;
    },

    setArchivePage: (
      state,
      action: {
        payload: number;
      }
    ) => {
      state.page = action.payload;
    },

    clearError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchArchives.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchArchives.fulfilled, (state, action) => {
      state.loading = false;
      state.loaded = true;
      state.items = action.payload;
    });

    builder.addCase(fetchArchives.rejected, (state, action) => {
      state.loading = false;
      state.loaded = false;
      state.error = action.payload as string;
    });


    builder.addCase(restoreRecord.pending, (state) => {
      state.error = null;
    });

    builder.addCase(restoreRecord.fulfilled, (state, action) => {
      state.items = state.items.filter(
        (item) =>
          !(
            item.id === action.meta.arg.id &&
            item.entityType === action.meta.arg.entity
          )
      );
    });

    builder.addCase(restoreRecord.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },
});


export const {
  setArchiveType,
  setArchiveEntity,
  setArchiveSearch,
  setArchivePage,
  clearError,
} = archiveSlice.actions;

export default archiveSlice.reducer;