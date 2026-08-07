import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import type {
  Organization,
  CreateWorkspaceDTO,
  OrganizationState,
} from "../types/organization";

import {
  createWorkspaceAPI,
  renameWorkspaceAPI,
} from "../services/organizationService";



const initialState: OrganizationState = {
  item: null,
  loading: false,
  loaded: false,
  error: null,
};


export const createWorkspace = createAsyncThunk(
  "organization/create-workspace",
  async (
    workspace: CreateWorkspaceDTO,
    thunkAPI
  ) => {

    try {

      return await createWorkspaceAPI(
        workspace
      );

    } catch (err) {

      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(
          err.message
        );
      }

      return thunkAPI.rejectWithValue(
        "Failed to create workspace"
      );

    }

  }
);


export const renameWorkspace = createAsyncThunk(
  "organization/rename-workspace",
  async (
    name: Pick<Organization, "name">,
    thunkAPI
  ) => {

    try {

      return await renameWorkspaceAPI(
        name
      );

    } catch (err) {

      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(
          err.message
        );
      }

      return thunkAPI.rejectWithValue(
        "Failed to rename workspace"
      );

    }

  }
);


const organizationSlice = createSlice({

  name: "organization",

  initialState,

  reducers: {

    clearError(state) {
      state.error = null;
    },

    clearOrganization(state) {
      state.item = null;
      state.loaded = false;
    },

  },

  extraReducers: (builder) => {

    builder.addCase(
      createWorkspace.pending,
      (state) => {

        state.loading = true;
        state.error = null;

      }
    );

    builder.addCase(
      createWorkspace.fulfilled,
      (state, action) => {

        state.loading = false;
        state.loaded = true;
        state.item = action.payload;

      }
    );

    builder.addCase(
      createWorkspace.rejected,
      (state, action) => {

        state.loading = false;
        state.error = action.payload as string;

      }
    );

    builder.addCase(
      renameWorkspace.pending,
      (state) => {

        state.loading = true;
        state.error = null;

      }
    );

    builder.addCase(
      renameWorkspace.fulfilled,
      (state, action) => {

        state.loading = false;
        state.item = action.payload;

      }
    );

    builder.addCase(
      renameWorkspace.rejected,
      (state, action) => {

        state.loading = false;
        state.error = action.payload as string;

      }
    );

  },

});


export const {
  clearError,
  clearOrganization,
} = organizationSlice.actions;

export default organizationSlice.reducer;