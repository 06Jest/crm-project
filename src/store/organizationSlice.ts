import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import type {
  OrganizationState,
  DisplayOrganization,
  UpdateWorkspaceDetailsDTO,
} from "../types/organization";

import {
  fetchWorkspaceAPI,
  renameWorkspaceAPI,
  updateWorkspaceDetailsAPI,
} from "../services/organizationService";


const initialState: OrganizationState = {
  item: null,
  loading: false,
  updating: false,
  loaded: false,
  error: null,
};


export const fetchWorkspace = createAsyncThunk(
  "organization/fetch-organization",
  async (_, thunkAPI) => {

    try {

      return await fetchWorkspaceAPI();

    } catch (err) {

      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(
          err.message
        );
      }

      return thunkAPI.rejectWithValue(
        "Failed to fetch organization"
      );
    }

  }
);


export const renameWorkspace = createAsyncThunk(
  "organization/rename-workspace",
  async (
    name: Pick<DisplayOrganization, "name">,
    thunkAPI
  ) => {

    try {

      return await renameWorkspaceAPI(name);

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


// NEW: powers the Workspace.tsx "Edit workspace details" form.
export const updateWorkspaceDetails = createAsyncThunk(
  "organization/update-workspace-details",
  async (
    updates: UpdateWorkspaceDetailsDTO,
    thunkAPI
  ) => {

    try {

      return await updateWorkspaceDetailsAPI(updates);

    } catch (err) {

      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(
          err.message
        );
      }

      return thunkAPI.rejectWithValue(
        "Failed to update workspace details"
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


    // FETCH ORGANIZATION

    builder.addCase(
      fetchWorkspace.pending,
      (state) => {

        state.loading = true;
        state.error = null;

      }
    );


    builder.addCase(
      fetchWorkspace.fulfilled,
      (state, action) => {

        state.loading = false;
        state.loaded = true;
        state.item = action.payload;

      }
    );


    builder.addCase(
      fetchWorkspace.rejected,
      (state, action) => {

        state.loading = false;
        state.error = action.payload as string;

      }
    );



    // RENAME WORKSPACE

    builder.addCase(
      renameWorkspace.pending,
      (state) => {

        state.updating = true;
        state.error = null;

      }
    );


    builder.addCase(
      renameWorkspace.fulfilled,
      (state, action) => {

        state.updating = false;
        state.item = action.payload;

      }
    );


    builder.addCase(
      renameWorkspace.rejected,
      (state, action) => {

        state.updating = false;
        state.error = action.payload as string;

      }
    );



    // UPDATE WORKSPACE DETAILS

    builder.addCase(
      updateWorkspaceDetails.pending,
      (state) => {

        state.updating = true;
        state.error = null;

      }
    );


    builder.addCase(
      updateWorkspaceDetails.fulfilled,
      (state, action) => {

        state.updating = false;
        state.item = action.payload;

      }
    );


    builder.addCase(
      updateWorkspaceDetails.rejected,
      (state, action) => {

        state.updating = false;
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